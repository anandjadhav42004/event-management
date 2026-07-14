import { pgTable, serial, text, timestamp, varchar, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const anchorsTable = pgTable("anchors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  specialization: varchar("specialization", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }),
  experience: integer("experience"),
  languages: varchar("languages", { length: 255 }),
  rating: numeric("rating", { precision: 3, scale: 1 }),
  fee: numeric("fee", { precision: 12, scale: 2 }),
  status: varchar("status", { length: 50 }).notNull().default("available"),
  bio: text("bio"),
  imageUrl: text("image_url"),
  totalEvents: integer("total_events").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAnchorSchema = createInsertSchema(anchorsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAnchor = z.infer<typeof insertAnchorSchema>;
export type Anchor = typeof anchorsTable.$inferSelect;
