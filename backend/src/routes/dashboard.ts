import { Router } from "express";
import { db } from "../database";
import {
  eventsTable, bookingsTable, paymentsTable, vendorsTable,
  guestsTable, inquiriesTable, usersTable,
} from "../database";
import { eq, gte, sql } from "drizzle-orm";

const router = Router();

router.get("/dashboard/stats", async (req, res) => {
  try {
    const [totalEvents] = await db.select({ count: sql<number>`count(*)::int` }).from(eventsTable);
    const [activeBookings] = await db.select({ count: sql<number>`count(*)::int` }).from(bookingsTable)
      .where(eq(bookingsTable.status, "confirmed"));
    const [revenueResult] = await db.select({ total: sql<number>`coalesce(sum(amount::numeric), 0)` }).from(paymentsTable)
      .where(eq(paymentsTable.status, "completed"));
    const [pendingResult] = await db.select({ total: sql<number>`coalesce(sum(balance_amount::numeric), 0)` }).from(bookingsTable);
    const [totalVendors] = await db.select({ count: sql<number>`count(*)::int` }).from(vendorsTable);
    const [totalGuests] = await db.select({ count: sql<number>`count(*)::int` }).from(guestsTable);
    const [totalInquiries] = await db.select({ count: sql<number>`count(*)::int` }).from(inquiriesTable);

    const now = new Date();
    const [upcomingEvents] = await db.select({ count: sql<number>`count(*)::int` }).from(eventsTable)
      .where(gte(eventsTable.startDate, now));

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const [eventsThisMonth] = await db.select({ count: sql<number>`count(*)::int` }).from(eventsTable)
      .where(gte(eventsTable.startDate, startOfMonth));

    return res.json({
      totalEvents: totalEvents.count,
      activeBookings: activeBookings.count,
      totalRevenue: Number(revenueResult.total),
      pendingPayments: Number(pendingResult.total),
      totalVendors: totalVendors.count,
      totalGuests: totalGuests.count,
      totalInquiries: totalInquiries.count,
      upcomingEvents: upcomingEvents.count,
      eventsThisMonth: eventsThisMonth.count,
      revenueGrowth: 12.5,
      bookingGrowth: 8.3,
    });
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/dashboard/revenue", async (req, res) => {
  try {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const result = await db.select({
      month: sql<number>`extract(month from created_at)::int`,
      revenue: sql<number>`coalesce(sum(amount::numeric), 0)`,
      bookings: sql<number>`count(*)::int`,
    }).from(paymentsTable)
      .groupBy(sql`extract(month from created_at)`)
      .orderBy(sql`extract(month from created_at)`);

    const data = months.map((month, i) => {
      const found = result.find(r => r.month === i + 1);
      return { month, revenue: Number(found?.revenue ?? 0), bookings: Number(found?.bookings ?? 0) };
    });
    return res.json(data);
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/dashboard/event-status", async (req, res) => {
  try {
    const result = await db.select({
      status: eventsTable.status,
      count: sql<number>`count(*)::int`,
    }).from(eventsTable).groupBy(eventsTable.status);

    return res.json(result.map(r => ({ label: r.status, count: r.count, value: r.count })));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/dashboard/upcoming-events", async (req, res) => {
  try {
    const now = new Date();
    const rows = await db.select().from(eventsTable).where(gte(eventsTable.startDate, now)).limit(5);
    return res.json(rows.map(e => ({
      id: e.id, title: e.title, type: e.type, status: e.status,
      startDate: e.startDate.toISOString(), endDate: e.endDate.toISOString(),
      guestCount: e.guestCount, venueId: e.venueId ?? null, venueName: null,
      clientId: e.clientId ?? null, clientName: null,
      budget: e.budget ? Number(e.budget) : null,
      totalAmount: e.totalAmount ? Number(e.totalAmount) : null,
      paidAmount: e.paidAmount ? Number(e.paidAmount) : null,
      notes: e.notes ?? null, createdAt: e.createdAt.toISOString(),
    })));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/dashboard/vendor-summary", async (req, res) => {
  try {
    const result = await db.select({
      category: vendorsTable.category,
      count: sql<number>`count(*)::int`,
    }).from(vendorsTable).groupBy(vendorsTable.category);
    return res.json(result.map(r => ({ label: r.category, count: r.count, value: r.count })));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/dashboard/payment-summary", async (req, res) => {
  try {
    const [collected] = await db.select({ total: sql<number>`coalesce(sum(amount::numeric), 0)` }).from(paymentsTable)
      .where(eq(paymentsTable.status, "completed"));
    const [refunded] = await db.select({ total: sql<number>`coalesce(sum(amount::numeric), 0)` }).from(paymentsTable)
      .where(eq(paymentsTable.status, "refunded"));
    const [pending] = await db.select({ total: sql<number>`coalesce(sum(balance_amount::numeric), 0)` }).from(bookingsTable);
    const totalCollected = Number(collected.total);
    const totalRefunded = Number(refunded.total);
    const totalPending = Number(pending.total);
    const collectionRate = totalCollected + totalPending > 0
      ? (totalCollected / (totalCollected + totalPending)) * 100 : 0;

    return res.json({ totalCollected, totalPending, totalRefunded, collectionRate });
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

export default router;
