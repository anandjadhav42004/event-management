import { pgTable, serial, text, timestamp, varchar, integer, numeric, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const inquiriesTable = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  clientEmail: varchar("client_email", { length: 255 }).notNull(),
  clientPhone: varchar("client_phone", { length: 50 }),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  eventDate: date("event_date").notNull(),
  guestCount: integer("guest_count"),
  budget: numeric("budget", { precision: 12, scale: 2 }),
  status: varchar("status", { length: 50 }).notNull().default("new"),
  notes: text("notes"),
  assignedTo: integer("assigned_to").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertInquirySchema = createInsertSchema(inquiriesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiriesTable.$inferSelect;
