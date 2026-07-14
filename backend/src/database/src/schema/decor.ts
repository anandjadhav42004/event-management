import { pgTable, serial, text, timestamp, varchar, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const decorTable = pgTable("decor", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  pricePerUnit: numeric("price_per_unit", { precision: 12, scale: 2 }).notNull(),
  available: boolean("available").notNull().default(true),
  imageUrl: text("image_url"),
  tags: text("tags"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDecorSchema = createInsertSchema(decorTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDecor = z.infer<typeof insertDecorSchema>;
export type Decor = typeof decorTable.$inferSelect;
