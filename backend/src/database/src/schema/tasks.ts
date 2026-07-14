import { pgTable, serial, text, timestamp, varchar, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { eventsTable } from "./events";
import { usersTable } from "./users";

export const tasksTable = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventId: integer("event_id").references(() => eventsTable.id),
  assigneeId: integer("assignee_id").references(() => usersTable.id),
  status: varchar("status", { length: 50 }).notNull().default("todo"),
  priority: varchar("priority", { length: 50 }).notNull().default("medium"),
  dueDate: date("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTaskSchema = createInsertSchema(tasksTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasksTable.$inferSelect;
