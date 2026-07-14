import { pgTable, serial, text, timestamp, varchar, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { eventsTable } from "./events";
import { usersTable } from "./users";
import { quotationsTable } from "./quotations";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => eventsTable.id),
  clientId: integer("client_id").notNull().references(() => usersTable.id),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  paidAmount: numeric("paid_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  balanceAmount: numeric("balance_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  quotationId: integer("quotation_id").references(() => quotationsTable.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
