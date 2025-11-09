import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, date, time, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const barbershopSettings = pgTable("barbershop_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().default("Barbearia Premium"),
  logoUrl: text("logo_url"),
  backgroundType: text("background_type").notNull().default("image"),
  backgroundColor: text("background_color").default("#000000"),
  backgroundImageUrl: text("background_image_url"),
  address: text("address").notNull().default("Rua dos Barbeiros, 123 - Centro - São Paulo, SP"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const barbers = pgTable("barbers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  profilePhotoUrl: text("profile_photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientName: text("client_name").notNull(),
  clientWhatsapp: text("client_whatsapp").notNull(),
  barberId: varchar("barber_id").notNull().references(() => barbers.id, { onDelete: "cascade" }),
  serviceId: varchar("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  appointmentDate: date("appointment_date").notNull(),
  appointmentTime: time("appointment_time").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const operatingHours = pgTable("operating_hours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dayOfWeek: integer("day_of_week").notNull(),
  openTime: time("open_time").notNull().default("09:00"),
  closeTime: time("close_time").notNull().default("21:00"),
  isClosed: boolean("is_closed").notNull().default(false),
});

export const insertBarbershopSettingsSchema = createInsertSchema(barbershopSettings).omit({
  id: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "Nome da barbearia é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
});

export const insertBarberSchema = createInsertSchema(barbers).omit({
  id: true,
  createdAt: true,
  passwordHash: true,
}).extend({
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(1, "Nome do serviço é obrigatório"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Preço deve ser um número válido com até 2 casas decimais"),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  status: true,
}).extend({
  clientName: z.string().min(1, "Nome do cliente é obrigatório"),
  clientWhatsapp: z.string().min(10, "WhatsApp deve ter no mínimo 10 dígitos"),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/, "Horário deve estar no formato HH:MM"),
});

export const insertOperatingHoursSchema = createInsertSchema(operatingHours).omit({
  id: true,
});

export type BarbershopSettings = typeof barbershopSettings.$inferSelect;
export type InsertBarbershopSettings = z.infer<typeof insertBarbershopSettingsSchema>;

export type Barber = typeof barbers.$inferSelect;
export type InsertBarber = z.infer<typeof insertBarberSchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type OperatingHours = typeof operatingHours.$inferSelect;
export type InsertOperatingHours = z.infer<typeof insertOperatingHoursSchema>;
