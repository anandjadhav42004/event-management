import { Router } from "express";
import { db } from "@workspace/db";
import { bookingsTable, eventsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function fmt(b: typeof bookingsTable.$inferSelect, eventTitle?: string | null, clientName?: string | null) {
  return {
    id: b.id, eventId: b.eventId, eventTitle: eventTitle ?? null,
    clientId: b.clientId, clientName: clientName ?? null,
    status: b.status,
    totalAmount: Number(b.totalAmount), paidAmount: Number(b.paidAmount), balanceAmount: Number(b.balanceAmount),
    quotationId: b.quotationId ?? null, notes: b.notes ?? null,
    createdAt: b.createdAt.toISOString(),
  };
}

router.get("/bookings", async (req, res) => {
  try {
    const { status, eventId } = req.query as Record<string, string>;
    let rows;
    if (status) rows = await db.select().from(bookingsTable).where(eq(bookingsTable.status, status));
    else if (eventId) rows = await db.select().from(bookingsTable).where(eq(bookingsTable.eventId, Number(eventId)));
    else rows = await db.select().from(bookingsTable);
    const result = await Promise.all(rows.map(async (b) => {
      const [ev] = await db.select().from(eventsTable).where(eq(eventsTable.id, b.eventId)).limit(1);
      const [cl] = await db.select().from(usersTable).where(eq(usersTable.id, b.clientId)).limit(1);
      return fmt(b, ev?.title, cl?.name);
    }));
    return res.json(result);
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.post("/bookings", async (req, res) => {
  try {
    const { eventId, clientId, totalAmount, quotationId, notes } = req.body;
    if (!eventId || !clientId || !totalAmount) return res.status(400).json({ error: "Required fields missing" });
    const [row] = await db.insert(bookingsTable).values({
      eventId, clientId, totalAmount: totalAmount.toString(), paidAmount: "0",
      balanceAmount: totalAmount.toString(), quotationId: quotationId ?? null,
      notes: notes ?? null, status: "pending",
    }).returning();
    const [ev] = await db.select().from(eventsTable).where(eq(eventsTable.id, row.eventId)).limit(1);
    const [cl] = await db.select().from(usersTable).where(eq(usersTable.id, row.clientId)).limit(1);
    return res.status(201).json(fmt(row, ev?.title, cl?.name));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/bookings/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, Number(req.params.id))).limit(1);
    if (!row) return res.status(404).json({ error: "Not found" });
    const [ev] = await db.select().from(eventsTable).where(eq(eventsTable.id, row.eventId)).limit(1);
    const [cl] = await db.select().from(usersTable).where(eq(usersTable.id, row.clientId)).limit(1);
    return res.json(fmt(row, ev?.title, cl?.name));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.patch("/bookings/:id", async (req, res) => {
  try {
    const { status, totalAmount, notes } = req.body;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (status) updates.status = status;
    if (totalAmount !== undefined) { updates.totalAmount = totalAmount.toString(); }
    if (notes !== undefined) updates.notes = notes;
    const [row] = await db.update(bookingsTable).set(updates).where(eq(bookingsTable.id, Number(req.params.id))).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    const [ev] = await db.select().from(eventsTable).where(eq(eventsTable.id, row.eventId)).limit(1);
    const [cl] = await db.select().from(usersTable).where(eq(usersTable.id, row.clientId)).limit(1);
    return res.json(fmt(row, ev?.title, cl?.name));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.delete("/bookings/:id", async (req, res) => {
  try {
    await db.delete(bookingsTable).where(eq(bookingsTable.id, Number(req.params.id)));
    return res.status(204).send();
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

export default router;
