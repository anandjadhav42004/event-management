import { pgTable, serial, text, timestamp, varchar, integer, numeric, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { eventsTable } from "./events";
import { usersTable } from "./users";

export const quotationsTable = pgTable("quotations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => eventsTable.id),
  clientId: integer("client_id").notNull().references(() => usersTable.id),
  status: varchar("status", { length: 50 }).notNull().default("draft"),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).notNull().default("18"),
  tax: numeric("tax", { precision: 12, scale: 2 }).notNull().default("0"),
  discount: numeric("discount", { precision: 12, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  validUntil: date("valid_until"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertQuotationSchema = createInsertSchema(quotationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertQuotation = z.infer<typeof insertQuotationSchema>;
export type Quotation = typeof quotationsTable.$inferSelect;
