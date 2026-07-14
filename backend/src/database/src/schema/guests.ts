import { pgTable, serial, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { eventsTable } from "./events";
import { roomsTable } from "./rooms";

export const guestsTable = pgTable("guests", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => eventsTable.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  rsvpStatus: varchar("rsvp_status", { length: 50 }).notNull().default("pending"),
  tableNumber: integer("table_number"),
  mealPreference: varchar("meal_preference", { length: 100 }),
  roomId: integer("room_id").references(() => roomsTable.id),
  checkIn: varchar("check_in", { length: 50 }),
  checkOut: varchar("check_out", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertGuestSchema = createInsertSchema(guestsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertGuest = z.infer<typeof insertGuestSchema>;
export type Guest = typeof guestsTable.$inferSelect;
