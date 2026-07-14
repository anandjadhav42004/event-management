import { Router } from "express";
import { db } from "../database";
import { paymentsTable, bookingsTable, eventsTable, usersTable } from "../database";
import { eq } from "drizzle-orm";

const router = Router();

async function fmt(p: typeof paymentsTable.$inferSelect) {
  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, p.bookingId)).limit(1);
  let eventTitle: string | null = null;
  let clientName: string | null = null;
  if (booking) {
    const [ev] = await db.select().from(eventsTable).where(eq(eventsTable.id, booking.eventId)).limit(1);
    const [cl] = await db.select().from(usersTable).where(eq(usersTable.id, booking.clientId)).limit(1);
    eventTitle = ev?.title ?? null;
    clientName = cl?.name ?? null;
  }
  return {
    id: p.id, bookingId: p.bookingId, eventTitle, clientName,
    amount: Number(p.amount), method: p.method, status: p.status,
    transactionId: p.transactionId ?? null, notes: p.notes ?? null,
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/payments", async (req, res) => {
  try {
    const { bookingId, status } = req.query as Record<string, string>;
    let rows;
    if (bookingId) rows = await db.select().from(paymentsTable).where(eq(paymentsTable.bookingId, Number(bookingId)));
    else if (status) rows = await db.select().from(paymentsTable).where(eq(paymentsTable.status, status));
    else rows = await db.select().from(paymentsTable);
    return res.json(await Promise.all(rows.map(fmt)));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.post("/payments", async (req, res) => {
  try {
    const { bookingId, amount, method, transactionId, notes } = req.body;
    if (!bookingId || !amount || !method) return res.status(400).json({ error: "Required fields missing" });
    const [row] = await db.insert(paymentsTable).values({
      bookingId, amount: amount.toString(), method,
      transactionId: transactionId ?? null, notes: notes ?? null, status: "completed",
    }).returning();
    // Update booking paid/balance amounts
    const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, bookingId)).limit(1);
    if (booking) {
      const newPaid = Number(booking.paidAmount) + amount;
      const newBalance = Number(booking.totalAmount) - newPaid;
      await db.update(bookingsTable).set({
        paidAmount: newPaid.toString(), balanceAmount: newBalance.toString(),
        status: newBalance <= 0 ? "confirmed" : "advance_paid", updatedAt: new Date(),
      }).where(eq(bookingsTable.id, bookingId));
    }
    return res.status(201).json(await fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/payments/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(paymentsTable).where(eq(paymentsTable.id, Number(req.params.id))).limit(1);
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(await fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.patch("/payments/:id", async (req, res) => {
  try {
    const { status, transactionId, notes } = req.body;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (status) updates.status = status;
    if (transactionId !== undefined) updates.transactionId = transactionId;
    if (notes !== undefined) updates.notes = notes;
    const [row] = await db.update(paymentsTable).set(updates).where(eq(paymentsTable.id, Number(req.params.id))).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(await fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

export default router;
