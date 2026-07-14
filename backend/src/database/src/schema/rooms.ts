import { pgTable, serial, text, timestamp, varchar, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { venuesTable } from "./venues";

export const roomsTable = pgTable("rooms", {
  id: serial("id").primaryKey(),
  venueId: integer("venue_id").notNull().references(() => venuesTable.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull().default("standard"),
  capacity: integer("capacity").notNull(),
  pricePerNight: numeric("price_per_night", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("available"),
  floor: integer("floor"),
  amenities: text("amenities"),
  guestName: varchar("guest_name", { length: 255 }),
  checkIn: varchar("check_in", { length: 50 }),
  checkOut: varchar("check_out", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertRoomSchema = createInsertSchema(roomsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof roomsTable.$inferSelect;
