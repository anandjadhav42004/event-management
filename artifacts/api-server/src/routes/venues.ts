import { Router } from "express";
import { db } from "@workspace/db";
import { venuesTable } from "@workspace/db";
import { eq, ilike } from "drizzle-orm";

const router = Router();

function fmt(v: typeof venuesTable.$inferSelect) {
  return {
    id: v.id, name: v.name, location: v.location, address: v.address ?? null,
    capacity: v.capacity, pricePerDay: Number(v.pricePerDay), status: v.status,
    amenities: v.amenities ?? null, imageUrl: v.imageUrl ?? null,
    description: v.description ?? null, createdAt: v.createdAt.toISOString(),
  };
}

router.get("/venues", async (req, res) => {
  try {
    const { search, available } = req.query as Record<string, string>;
    let rows;
    if (available === "true") rows = await db.select().from(venuesTable).where(eq(venuesTable.status, "available"));
    else if (search) rows = await db.select().from(venuesTable).where(ilike(venuesTable.name, `%${search}%`));
    else rows = await db.select().from(venuesTable);
    return res.json(rows.map(fmt));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.post("/venues", async (req, res) => {
  try {
    const { name, location, address, capacity, pricePerDay, amenities, imageUrl, description } = req.body;
    if (!name || !location || !capacity || !pricePerDay) return res.status(400).json({ error: "Required fields missing" });
    const [row] = await db.insert(venuesTable).values({
      name, location, address, capacity, pricePerDay: pricePerDay.toString(),
      amenities, imageUrl, description, status: "available",
    }).returning();
    return res.status(201).json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/venues/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(venuesTable).where(eq(venuesTable.id, Number(req.params.id))).limit(1);
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.patch("/venues/:id", async (req, res) => {
  try {
    const updates = req.body;
    if (updates.pricePerDay) updates.pricePerDay = updates.pricePerDay.toString();
    const [row] = await db.update(venuesTable).set({ ...updates, updatedAt: new Date() }).where(eq(venuesTable.id, Number(req.params.id))).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.delete("/venues/:id", async (req, res) => {
  try {
    await db.delete(venuesTable).where(eq(venuesTable.id, Number(req.params.id)));
    return res.status(204).send();
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

export default router;
