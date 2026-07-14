import { pgTable, serial, text, timestamp, varchar, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { venuesTable } from "./venues";
import { usersTable } from "./users";

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull().default("wedding"),
  status: varchar("status", { length: 50 }).notNull().default("planning"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  guestCount: integer("guest_count").notNull().default(0),
  venueId: integer("venue_id").references(() => venuesTable.id),
  clientId: integer("client_id").references(() => usersTable.id),
  budget: numeric("budget", { precision: 12, scale: 2 }),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }),
  paidAmount: numeric("paid_amount", { precision: 12, scale: 2 }).default("0"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertEventSchema = createInsertSchema(eventsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof eventsTable.$inferSelect;
