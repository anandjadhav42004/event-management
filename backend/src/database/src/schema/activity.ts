import { pgTable, serial, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const activityTable = pgTable("activity", {
  id: serial("id").primaryKey(),
  action: varchar("action", { length: 255 }).notNull(),
  entity: varchar("entity", { length: 100 }).notNull(),
  entityId: integer("entity_id").notNull(),
  entityTitle: varchar("entity_title", { length: 255 }),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivitySchema = createInsertSchema(activityTable).omit({ id: true, createdAt: true });
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activityTable.$inferSelect;
