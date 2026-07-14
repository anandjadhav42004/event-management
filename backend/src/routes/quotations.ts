import { Router } from "express";
import { db } from "../database";
import { quotationsTable, eventsTable, usersTable } from "../database";
import { eq } from "drizzle-orm";

const router = Router();

function fmt(q: typeof quotationsTable.$inferSelect, eventTitle?: string | null, clientName?: string | null) {
  return {
    id: q.id, eventId: q.eventId, eventTitle: eventTitle ?? null,
    clientId: q.clientId, clientName: clientName ?? null,
    status: q.status,
    subtotal: Number(q.subtotal), taxRate: Number(q.taxRate),
    tax: Number(q.tax), discount: Number(q.discount), total: Number(q.total),
    validUntil: q.validUntil ?? null, notes: q.notes ?? null,
    createdAt: q.createdAt.toISOString(),
  };
}

router.get("/quotations", async (req, res) => {
  try {
    const { status, clientId } = req.query as Record<string, string>;
    let rows;
    if (status) rows = await db.select().from(quotationsTable).where(eq(quotationsTable.status, status));
    else if (clientId) rows = await db.select().from(quotationsTable).where(eq(quotationsTable.clientId, Number(clientId)));
    else rows = await db.select().from(quotationsTable);
    const result = await Promise.all(rows.map(async (q) => {
      const [ev] = await db.select().from(eventsTable).where(eq(eventsTable.id, q.eventId)).limit(1);
      const [cl] = await db.select().from(usersTable).where(eq(usersTable.id, q.clientId)).limit(1);
      return fmt(q, ev?.title, cl?.name);
    }));
    return res.json(result);
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.post("/quotations", async (req, res) => {
  try {
    const { eventId, clientId, subtotal, taxRate = 18, discount = 0, validUntil, notes } = req.body;
    if (!eventId || !clientId || subtotal === undefined) return res.status(400).json({ error: "Required fields missing" });
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax - discount;
    const [row] = await db.insert(quotationsTable).values({
      eventId, clientId, subtotal: subtotal.toString(), taxRate: taxRate.toString(),
      tax: tax.toString(), discount: discount.toString(), total: total.toString(),
      validUntil: validUntil ?? null, notes: notes ?? null, status: "draft",
    }).returning();
    const [ev] = await db.select().from(eventsTable).where(eq(eventsTable.id, row.eventId)).limit(1);
    const [cl] = await db.select().from(usersTable).where(eq(usersTable.id, row.clientId)).limit(1);
    return res.status(201).json(fmt(row, ev?.title, cl?.name));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/quotations/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(quotationsTable).where(eq(quotationsTable.id, Number(req.params.id))).limit(1);
    if (!row) return res.status(404).json({ error: "Not found" });
    const [ev] = await db.select().from(eventsTable).where(eq(eventsTable.id, row.eventId)).limit(1);
    const [cl] = await db.select().from(usersTable).where(eq(usersTable.id, row.clientId)).limit(1);
    return res.json(fmt(row, ev?.title, cl?.name));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.patch("/quotations/:id", async (req, res) => {
  try {
    const { status, subtotal, taxRate, discount, validUntil, notes } = req.body;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (status) updates.status = status;
    if (subtotal !== undefined) {
      const tr = taxRate ?? 18; const d = discount ?? 0;
      const tax = (subtotal * tr) / 100; const total = subtotal + tax - d;
      updates.subtotal = subtotal.toString(); updates.tax = tax.toString(); updates.total = total.toString();
      if (taxRate !== undefined) updates.taxRate = taxRate.toString();
      if (discount !== undefined) updates.discount = discount.toString();
    }
    if (validUntil !== undefined) updates.validUntil = validUntil;
    if (notes !== undefined) updates.notes = notes;
    const [row] = await db.update(quotationsTable).set(updates).where(eq(quotationsTable.id, Number(req.params.id))).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    const [ev] = await db.select().from(eventsTable).where(eq(eventsTable.id, row.eventId)).limit(1);
    const [cl] = await db.select().from(usersTable).where(eq(usersTable.id, row.clientId)).limit(1);
    return res.json(fmt(row, ev?.title, cl?.name));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

export default router;
