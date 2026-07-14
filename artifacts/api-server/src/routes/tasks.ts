import { Router } from "express";
import { db } from "@workspace/db";
import { tasksTable, eventsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function fmt(t: typeof tasksTable.$inferSelect, eventTitle?: string | null, assigneeName?: string | null) {
  return {
    id: t.id, title: t.title, description: t.description ?? null,
    eventId: t.eventId ?? null, eventTitle: eventTitle ?? null,
    assigneeId: t.assigneeId ?? null, assigneeName: assigneeName ?? null,
    status: t.status, priority: t.priority,
    dueDate: t.dueDate ?? null,
    completedAt: t.completedAt ? t.completedAt.toISOString() : null,
    createdAt: t.createdAt.toISOString(),
  };
}

router.get("/tasks", async (req, res) => {
  try {
    const { eventId, assigneeId, status } = req.query as Record<string, string>;
    let rows;
    if (eventId) rows = await db.select().from(tasksTable).where(eq(tasksTable.eventId, Number(eventId)));
    else if (assigneeId) rows = await db.select().from(tasksTable).where(eq(tasksTable.assigneeId, Number(assigneeId)));
    else if (status) rows = await db.select().from(tasksTable).where(eq(tasksTable.status, status));
    else rows = await db.select().from(tasksTable);
    const result = await Promise.all(rows.map(async (t) => {
      const ev = t.eventId ? (await db.select().from(eventsTable).where(eq(eventsTable.id, t.eventId)).limit(1))[0] : null;
      const as = t.assigneeId ? (await db.select().from(usersTable).where(eq(usersTable.id, t.assigneeId)).limit(1))[0] : null;
      return fmt(t, ev?.title, as?.name);
    }));
    return res.json(result);
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.post("/tasks", async (req, res) => {
  try {
    const { title, description, eventId, assigneeId, status = "todo", priority = "medium", dueDate } = req.body;
    if (!title) return res.status(400).json({ error: "title required" });
    const [row] = await db.insert(tasksTable).values({
      title, description: description ?? null,
      eventId: eventId ?? null, assigneeId: assigneeId ?? null,
      status, priority, dueDate: dueDate ?? null,
    }).returning();
    const ev = row.eventId ? (await db.select().from(eventsTable).where(eq(eventsTable.id, row.eventId)).limit(1))[0] : null;
    const as = row.assigneeId ? (await db.select().from(usersTable).where(eq(usersTable.id, row.assigneeId)).limit(1))[0] : null;
    return res.status(201).json(fmt(row, ev?.title, as?.name));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/tasks/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(tasksTable).where(eq(tasksTable.id, Number(req.params.id))).limit(1);
    if (!row) return res.status(404).json({ error: "Not found" });
    const ev = row.eventId ? (await db.select().from(eventsTable).where(eq(eventsTable.id, row.eventId)).limit(1))[0] : null;
    const as = row.assigneeId ? (await db.select().from(usersTable).where(eq(usersTable.id, row.assigneeId)).limit(1))[0] : null;
    return res.json(fmt(row, ev?.title, as?.name));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.patch("/tasks/:id", async (req, res) => {
  try {
    const { title, description, status, priority, assigneeId, dueDate } = req.body;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (title) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status) { updates.status = status; if (status === "completed") updates.completedAt = new Date(); }
    if (priority) updates.priority = priority;
    if (assigneeId !== undefined) updates.assigneeId = assigneeId;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    const [row] = await db.update(tasksTable).set(updates).where(eq(tasksTable.id, Number(req.params.id))).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    const ev = row.eventId ? (await db.select().from(eventsTable).where(eq(eventsTable.id, row.eventId)).limit(1))[0] : null;
    const as = row.assigneeId ? (await db.select().from(usersTable).where(eq(usersTable.id, row.assigneeId)).limit(1))[0] : null;
    return res.json(fmt(row, ev?.title, as?.name));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    await db.delete(tasksTable).where(eq(tasksTable.id, Number(req.params.id)));
    return res.status(204).send();
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

export default router;
