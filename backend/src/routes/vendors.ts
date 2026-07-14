import { Router } from "express";
import { db } from "../database";
import { vendorsTable } from "../database";
import { eq, ilike } from "drizzle-orm";

const router = Router();

function fmt(v: typeof vendorsTable.$inferSelect) {
  return {
    id: v.id, name: v.name, category: v.category,
    contactName: v.contactName, email: v.email, phone: v.phone ?? null,
    address: v.address ?? null, status: v.status,
    rating: v.rating ? Number(v.rating) : null,
    totalEvents: v.totalEvents ?? null,
    basePrice: v.basePrice ? Number(v.basePrice) : null,
    notes: v.notes ?? null, createdAt: v.createdAt.toISOString(),
  };
}

router.get("/vendors", async (req, res) => {
  try {
    const { category, search, status } = req.query as Record<string, string>;
    let rows;
    if (category) rows = await db.select().from(vendorsTable).where(eq(vendorsTable.category, category));
    else if (status) rows = await db.select().from(vendorsTable).where(eq(vendorsTable.status, status));
    else if (search) rows = await db.select().from(vendorsTable).where(ilike(vendorsTable.name, `%${search}%`));
    else rows = await db.select().from(vendorsTable);
    return res.json(rows.map(fmt));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.post("/vendors", async (req, res) => {
  try {
    const { name, category, contactName, email, phone, address, basePrice, notes } = req.body;
    if (!name || !category || !contactName || !email) return res.status(400).json({ error: "Required fields missing" });
    const [row] = await db.insert(vendorsTable).values({
      name, category, contactName, email, phone: phone ?? null,
      address: address ?? null, basePrice: basePrice?.toString() ?? null, notes: notes ?? null, status: "active",
    }).returning();
    return res.status(201).json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/vendors/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(vendorsTable).where(eq(vendorsTable.id, Number(req.params.id))).limit(1);
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.patch("/vendors/:id", async (req, res) => {
  try {
    const updates = req.body;
    if (updates.basePrice) updates.basePrice = updates.basePrice.toString();
    if (updates.rating) updates.rating = updates.rating.toString();
    const [row] = await db.update(vendorsTable).set({ ...updates, updatedAt: new Date() }).where(eq(vendorsTable.id, Number(req.params.id))).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.delete("/vendors/:id", async (req, res) => {
  try {
    await db.delete(vendorsTable).where(eq(vendorsTable.id, Number(req.params.id)));
    return res.status(204).send();
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

export default router;
