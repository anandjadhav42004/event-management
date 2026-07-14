import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable, venuesTable, usersTable } from "@workspace/db";
import { eq, ilike } from "drizzle-orm";

const router = Router();

function fmt(e: typeof eventsTable.$inferSelect, venueName?: string | null, clientName?: string | null) {
  return {
    id: e.id, title: e.title, type: e.type, status: e.status,
    startDate: e.startDate.toISOString(), endDate: e.endDate.toISOString(),
    guestCount: e.guestCount,
    venueId: e.venueId ?? null, venueName: venueName ?? null,
    clientId: e.clientId ?? null, clientName: clientName ?? null,
    budget: e.budget ? Number(e.budget) : null,
    totalAmount: e.totalAmount ? Number(e.totalAmount) : null,
    paidAmount: e.paidAmount ? Number(e.paidAmount) : null,
    notes: e.notes ?? null, createdAt: e.createdAt.toISOString(),
  };
}

router.get("/events", async (req, res) => {
  try {
    const { status, type, search } = req.query as Record<string, string>;
    let rows;
    if (status) rows = await db.select().from(eventsTable).where(eq(eventsTable.status, status));
    else if (type) rows = await db.select().from(eventsTable).where(eq(eventsTable.type, type));
    else if (search) rows = await db.select().from(eventsTable).where(ilike(eventsTable.title, `%${search}%`));
    else rows = await db.select().from(eventsTable);

    const result = await Promise.all(rows.map(async (e) => {
      const venue = e.venueId ? (await db.select().from(venuesTable).where(eq(venuesTable.id, e.venueId)).limit(1))[0] : null;
      const client = e.clientId ? (await db.select().from(usersTable).where(eq(usersTable.id, e.clientId)).limit(1))[0] : null;
      return fmt(e, venue?.name, client?.name);
    }));
    return res.json(result);
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.post("/events", async (req, res) => {
  try {
    const { title, type, startDate, endDate, guestCount, venueId, clientId, budget, notes } = req.body;
    if (!title || !type || !startDate || !endDate) return res.status(400).json({ error: "Required fields missing" });
    const [row] = await db.insert(eventsTable).values({
      title, type, startDate: new Date(startDate), endDate: new Date(endDate),
      guestCount: guestCount ?? 0, venueId: venueId ?? null, clientId: clientId ?? null,
      budget: budget?.toString() ?? null, notes, status: "planning",
    }).returning();
    const venue = row.venueId ? (await db.select().from(venuesTable).where(eq(venuesTable.id, row.venueId)).limit(1))[0] : null;
    const client = row.clientId ? (await db.select().from(usersTable).where(eq(usersTable.id, row.clientId)).limit(1))[0] : null;
    return res.status(201).json(fmt(row, venue?.name, client?.name));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/events/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(eventsTable).where(eq(eventsTable.id, Number(req.params.id))).limit(1);
    if (!row) return res.status(404).json({ error: "Not found" });
    const venue = row.venueId ? (await db.select().from(venuesTable).where(eq(venuesTable.id, row.venueId)).limit(1))[0] : null;
    const client = row.clientId ? (await db.select().from(usersTable).where(eq(usersTable.id, row.clientId)).limit(1))[0] : null;
    return res.json(fmt(row, venue?.name, client?.name));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.patch("/events/:id", async (req, res) => {
  try {
    const { title, status, startDate, endDate, guestCount, venueId, notes } = req.body;
    const [row] = await db.update(eventsTable).set({
      ...(title && { title }), ...(status && { status }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
      ...(guestCount !== undefined && { guestCount }),
      ...(venueId !== undefined && { venueId }),
      ...(notes !== undefined && { notes }),
      updatedAt: new Date(),
    }).where(eq(eventsTable.id, Number(req.params.id))).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    const venue = row.venueId ? (await db.select().from(venuesTable).where(eq(venuesTable.id, row.venueId)).limit(1))[0] : null;
    const client = row.clientId ? (await db.select().from(usersTable).where(eq(usersTable.id, row.clientId)).limit(1))[0] : null;
    return res.json(fmt(row, venue?.name, client?.name));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.delete("/events/:id", async (req, res) => {
  try {
    await db.delete(eventsTable).where(eq(eventsTable.id, Number(req.params.id)));
    return res.status(204).send();
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

export default router;
