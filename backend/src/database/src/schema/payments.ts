import { pgTable, serial, text, timestamp, varchar, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { bookingsTable } from "./bookings";

export const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookingsTable.id),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  method: varchar("method", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("completed"),
  transactionId: varchar("transaction_id", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPaymentSchema = createInsertSchema(paymentsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof paymentsTable.$inferSelect;
