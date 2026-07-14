import { Router } from "express";
import { db } from "../database";
import { guestsTable, eventsTable } from "../database";
import { eq, ilike } from "drizzle-orm";

const router = Router();

function fmt(g: typeof guestsTable.$inferSelect, eventTitle?: string | null) {
  return {
    id: g.id, eventId: g.eventId, eventTitle: eventTitle ?? null,
    name: g.name, email: g.email, phone: g.phone ?? null,
    rsvpStatus: g.rsvpStatus, tableNumber: g.tableNumber ?? null,
    mealPreference: g.mealPreference ?? null, roomId: g.roomId ?? null,
    checkIn: g.checkIn ?? null, checkOut: g.checkOut ?? null,
    notes: g.notes ?? null, createdAt: g.createdAt.toISOString(),
  };
}

router.get("/guests", async (req, res) => {
  try {
    const { eventId, rsvpStatus, search } = req.query as Record<string, string>;
    let rows;
    if (eventId) rows = await db.select().from(guestsTable).where(eq(guestsTable.eventId, Number(eventId)));
    else if (rsvpStatus) rows = await db.select().from(guestsTable).where(eq(guestsTable.rsvpStatus, rsvpStatus));
    else if (search) rows = await db.select().from(guestsTable).where(ilike(guestsTable.name, `%${search}%`));
    else rows = await db.select().from(guestsTable);
    const result = await Promise.all(rows.map(async (g) => {
      const [ev] = await db.select().from(eventsTable).where(eq(eventsTable.id, g.eventId)).limit(1);
      return fmt(g, ev?.title);
    }));
    return res.json(result);
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.post("/guests", async (req, res) => {
  try {
    const { eventId, name, email, phone, mealPreference, roomId, tableNumber, notes } = req.body;
    if (!eventId || !name || !email) return res.status(400).json({ error: "Required fields missing" });
    const [row] = await db.insert(guestsTable).values({
      eventId, name, email, phone: phone ?? null,
      mealPreference: mealPreference ?? null, roomId: roomId ?? null,
      tableNumber: tableNumber ?? null, notes: notes ?? null, rsvpStatus: "pending",
    }).returning();
    const [ev] = await db.select().from(eventsTable).where(eq(eventsTable.id, row.eventId)).limit(1);
    return res.status(201).json(fmt(row, ev?.title));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/guests/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(guestsTable).where(eq(guestsTable.id, Number(req.params.id))).limit(1);
    if (!row) return res.status(404).json({ error: "Not found" });
    const [ev] = await db.select().from(eventsTable).where(eq(eventsTable.id, row.eventId)).limit(1);
    return res.json(fmt(row, ev?.title));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.patch("/guests/:id", async (req, res) => {
  try {
    const updates = req.body;
    const [row] = await db.update(guestsTable).set({ ...updates, updatedAt: new Date() }).where(eq(guestsTable.id, Number(req.params.id))).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    const [ev] = await db.select().from(eventsTable).where(eq(eventsTable.id, row.eventId)).limit(1);
    return res.json(fmt(row, ev?.title));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.delete("/guests/:id", async (req, res) => {
  try {
    await db.delete(guestsTable).where(eq(guestsTable.id, Number(req.params.id)));
    return res.status(204).send();
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

export default router;
