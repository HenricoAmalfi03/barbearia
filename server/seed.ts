import { db } from "./db";
import { barbershopSettings, operatingHours } from "@shared/schema";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  const existingSettings = await db.select().from(barbershopSettings).limit(1);
  
  if (existingSettings.length === 0) {
    await db.insert(barbershopSettings).values({
      name: "Barbearia Premium",
      backgroundType: "image",
      backgroundColor: "#000000",
      address: "Rua dos Barbeiros, 123 - Centro - São Paulo, SP",
    });
    console.log("✓ Barbershop settings created");
  }

  const existingHours = await db.select().from(operatingHours).limit(1);
  
  if (existingHours.length === 0) {
    const days = [
      { dayOfWeek: 1, openTime: "09:00", closeTime: "21:00", isClosed: false },
      { dayOfWeek: 2, openTime: "09:00", closeTime: "21:00", isClosed: false },
      { dayOfWeek: 3, openTime: "09:00", closeTime: "21:00", isClosed: false },
      { dayOfWeek: 4, openTime: "09:00", closeTime: "21:00", isClosed: false },
      { dayOfWeek: 5, openTime: "09:00", closeTime: "21:00", isClosed: false },
      { dayOfWeek: 6, openTime: "09:00", closeTime: "21:00", isClosed: false },
      { dayOfWeek: 0, openTime: "09:00", closeTime: "21:00", isClosed: true },
    ];

    await db.insert(operatingHours).values(days);
    console.log("✓ Operating hours created");
  }

  console.log("✨ Seeding complete!");
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
