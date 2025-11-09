import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { 
  barbershopSettings, 
  barbers, 
  services, 
  appointments, 
  operatingHours,
  insertBarbershopSettingsSchema,
  insertBarberSchema,
  insertServiceSchema,
  insertAppointmentSchema,
  insertOperatingHoursSchema
} from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import { supabaseServer } from "./lib/supabase";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ============ BARBERSHOP SETTINGS ============
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await db.select().from(barbershopSettings).limit(1);
      if (settings.length === 0) {
        return res.status(404).json({ error: "Settings not found" });
      }
      res.json(settings[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const validated = insertBarbershopSettingsSchema.parse(req.body);
      
      const existing = await db.select().from(barbershopSettings).limit(1);
      
      if (existing.length === 0) {
        const newSettings = await db.insert(barbershopSettings).values(validated).returning();
        return res.json(newSettings[0]);
      }

      const updated = await db.update(barbershopSettings)
        .set({
          ...validated,
          updatedAt: new Date(),
        })
        .where(eq(barbershopSettings.id, existing[0].id))
        .returning();

      res.json(updated[0]);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // ============ UPLOAD TO SUPABASE STORAGE ============
  app.post("/api/upload", async (req, res) => {
    try {
      const { file, bucket, fileName } = req.body;
      
      if (!file || !bucket || !fileName) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const base64Data = file.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');

      const { data, error } = await supabaseServer.storage
        .from(bucket)
        .upload(fileName, buffer, {
          contentType: 'image/png',
          upsert: true,
        });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const { data: urlData } = supabaseServer.storage
        .from(bucket)
        .getPublicUrl(data.path);

      res.json({ url: urlData.publicUrl });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // ============ SERVICES ============
  app.get("/api/services", async (req, res) => {
    try {
      const allServices = await db.select().from(services).orderBy(services.createdAt);
      res.json(allServices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const validated = insertServiceSchema.parse(req.body);
      const newService = await db.insert(services).values(validated).returning();
      res.json(newService[0]);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    try {
      await db.delete(services).where(eq(services.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // ============ BARBERS ============
  app.get("/api/barbers", async (req, res) => {
    try {
      const allBarbers = await db.select({
        id: barbers.id,
        name: barbers.name,
        email: barbers.email,
        profilePhotoUrl: barbers.profilePhotoUrl,
        createdAt: barbers.createdAt,
      }).from(barbers).orderBy(barbers.createdAt);
      res.json(allBarbers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch barbers" });
    }
  });

  app.post("/api/barbers", async (req, res) => {
    try {
      const validated = insertBarberSchema.parse(req.body);
      
      const passwordHash = await bcrypt.hash(validated.password, 10);
      
      const newBarber = await db.insert(barbers).values({
        name: validated.name,
        email: validated.email,
        passwordHash,
        profilePhotoUrl: validated.profilePhotoUrl,
      }).returning();

      const { passwordHash: _, ...barberWithoutPassword } = newBarber[0];
      res.json(barberWithoutPassword);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors[0].message });
      }
      if (error.code === '23505') {
        return res.status(400).json({ error: "Email already exists" });
      }
      res.status(500).json({ error: "Failed to create barber" });
    }
  });

  app.delete("/api/barbers/:id", async (req, res) => {
    try {
      await db.delete(barbers).where(eq(barbers.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete barber" });
    }
  });

  app.post("/api/barbers/login", async (req, res) => {
    try {
      const loginSchema = z.object({
        email: z.string().email("Email inválido"),
        password: z.string().min(1, "Senha é obrigatória"),
      });
      
      const { email, password } = loginSchema.parse(req.body);
      
      const barber = await db.select().from(barbers).where(eq(barbers.email, email)).limit(1);
      
      if (barber.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, barber[0].passwordHash);
      
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const { passwordHash: _, ...barberWithoutPassword } = barber[0];
      res.json(barberWithoutPassword);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.put("/api/barbers/:id", async (req, res) => {
    try {
      const updateSchema = z.object({
        name: z.string().min(1, "Nome é obrigatório"),
        profilePhotoUrl: z.string().optional(),
      });
      
      const validated = updateSchema.parse(req.body);
      
      const updated = await db.update(barbers)
        .set(validated)
        .where(eq(barbers.id, req.params.id))
        .returning();

      const { passwordHash: _, ...barberWithoutPassword } = updated[0];
      res.json(barberWithoutPassword);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to update barber" });
    }
  });

  // ============ OPERATING HOURS ============
  app.get("/api/operating-hours", async (req, res) => {
    try {
      const hours = await db.select().from(operatingHours).orderBy(operatingHours.dayOfWeek);
      res.json(hours);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch operating hours" });
    }
  });

  app.put("/api/operating-hours/:id", async (req, res) => {
    try {
      const validated = insertOperatingHoursSchema.parse(req.body);
      
      const updated = await db.update(operatingHours)
        .set(validated)
        .where(eq(operatingHours.id, req.params.id))
        .returning();

      res.json(updated[0]);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to update operating hours" });
    }
  });

  // ============ APPOINTMENTS ============
  app.get("/api/appointments", async (req, res) => {
    try {
      const { barberId, date } = req.query;
      
      const filters = [];
      if (barberId) {
        filters.push(eq(appointments.barberId, barberId as string));
      }
      if (date) {
        filters.push(eq(appointments.appointmentDate, date as string));
      }
      
      let query = db.select().from(appointments);
      if (filters.length > 0) {
        query = query.where(and(...filters)) as any;
      }
      
      const allAppointments = await query.orderBy(appointments.appointmentDate, appointments.appointmentTime);
      res.json(allAppointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const validated = insertAppointmentSchema.parse(req.body);

      const existing = await db.select()
        .from(appointments)
        .where(
          and(
            eq(appointments.barberId, validated.barberId),
            eq(appointments.appointmentDate, validated.appointmentDate),
            eq(appointments.appointmentTime, validated.appointmentTime),
            sql`${appointments.status} != 'cancelled'`
          )
        )
        .limit(1);

      if (existing.length > 0) {
        return res.status(400).json({ error: "Horário já está reservado para este barbeiro" });
      }

      const newAppointment = await db.insert(appointments).values({
        ...validated,
        status: "pending",
      }).returning();

      res.json(newAppointment[0]);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to create appointment" });
    }
  });

  app.put("/api/appointments/:id/status", async (req, res) => {
    try {
      const statusSchema = z.object({
        status: z.enum(["pending", "completed", "cancelled", "no_show"]),
      });
      
      const { status } = statusSchema.parse(req.body);
      
      const updated = await db.update(appointments)
        .set({ status })
        .where(eq(appointments.id, req.params.id))
        .returning();

      res.json(updated[0]);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to update appointment status" });
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      await db.delete(appointments).where(eq(appointments.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete appointment" });
    }
  });

  // ============ REPORTS ============
  app.get("/api/reports/revenue", async (req, res) => {
    try {
      const completedAppointments = await db
        .select({
          id: appointments.id,
          clientName: appointments.clientName,
          appointmentDate: appointments.appointmentDate,
          appointmentTime: appointments.appointmentTime,
          barberName: barbers.name,
          serviceName: services.name,
          servicePrice: services.price,
        })
        .from(appointments)
        .innerJoin(barbers, eq(appointments.barberId, barbers.id))
        .innerJoin(services, eq(appointments.serviceId, services.id))
        .where(eq(appointments.status, "completed"))
        .orderBy(appointments.appointmentDate, appointments.appointmentTime);

      // Parse numeric price strings to floats for accurate sum
      const totalRevenue = completedAppointments.reduce((sum, apt) => {
        return sum + parseFloat(apt.servicePrice as string);
      }, 0);

      res.json({
        appointments: completedAppointments,
        totalRevenue,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch revenue report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
