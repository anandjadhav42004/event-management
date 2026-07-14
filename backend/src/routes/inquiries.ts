import { Router } from "express";
import { db } from "../database";
import { inquiriesTable } from "../database";
import { eq, ilike } from "drizzle-orm";

const router = Router();

function fmt(r: typeof inquiriesTable.$inferSelect) {
  return {
    id: r.id,
    clientName: r.clientName,
    clientEmail: r.clientEmail,
    clientPhone: r.clientPhone ?? null,
    eventType: r.eventType,
    eventDate: r.eventDate,
    guestCount: r.guestCount ?? null,
    budget: r.budget ? Number(r.budget) : null,
    status: r.status,
    notes: r.notes ?? null,
    assignedTo: r.assignedTo ?? null,
    createdAt: r.createdAt.toISOString(),
  };
}

router.get("/inquiries", async (req, res) => {
  try {
    const { status, search } = req.query as Record<string, string>;
    let rows;
    if (status) {
      rows = await db.select().from(inquiriesTable).where(eq(inquiriesTable.status, status));
    } else if (search) {
      rows = await db.select().from(inquiriesTable).where(ilike(inquiriesTable.clientName, `%${search}%`));
    } else {
      rows = await db.select().from(inquiriesTable);
    }
    return res.json(rows.map(fmt));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.post("/inquiries", async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone, eventType, eventDate, guestCount, budget, notes, assignedTo } = req.body;
    if (!clientName || !clientEmail || !eventType || !eventDate) return res.status(400).json({ error: "Required fields missing" });
    const [row] = await db.insert(inquiriesTable).values({
      clientName, clientEmail, clientPhone, eventType, eventDate,
      guestCount: guestCount ?? null, budget: budget?.toString() ?? null,
      notes, assignedTo: assignedTo ?? null, status: "new",
    }).returning();
    return res.status(201).json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/inquiries/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(inquiriesTable).where(eq(inquiriesTable.id, Number(req.params.id))).limit(1);
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.patch("/inquiries/:id", async (req, res) => {
  try {
    const { status, notes, assignedTo, budget } = req.body;
    const [row] = await db.update(inquiriesTable)
      .set({ ...(status && { status }), ...(notes !== undefined && { notes }), ...(assignedTo !== undefined && { assignedTo }), ...(budget !== undefined && { budget: budget?.toString() }), updatedAt: new Date() })
      .where(eq(inquiriesTable.id, Number(req.params.id))).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

export default router;
