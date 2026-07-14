import { Router } from "express";
import { db } from "../database";
import { roomsTable, venuesTable } from "../database";
import { eq } from "drizzle-orm";

const router = Router();

function fmt(r: typeof roomsTable.$inferSelect, venueName?: string | null) {
  return {
    id: r.id, venueId: r.venueId, venueName: venueName ?? null,
    name: r.name, type: r.type, capacity: r.capacity,
    pricePerNight: Number(r.pricePerNight), status: r.status,
    floor: r.floor ?? null, amenities: r.amenities ?? null,
    guestName: r.guestName ?? null, checkIn: r.checkIn ?? null, checkOut: r.checkOut ?? null,
    createdAt: r.createdAt.toISOString(),
  };
}

router.get("/rooms", async (req, res) => {
  try {
    const { venueId, available } = req.query as Record<string, string>;
    let rows;
    if (venueId) rows = await db.select().from(roomsTable).where(eq(roomsTable.venueId, Number(venueId)));
    else if (available === "true") rows = await db.select().from(roomsTable).where(eq(roomsTable.status, "available"));
    else rows = await db.select().from(roomsTable);
    const result = await Promise.all(rows.map(async (r) => {
      const [venue] = await db.select().from(venuesTable).where(eq(venuesTable.id, r.venueId)).limit(1);
      return fmt(r, venue?.name);
    }));
    return res.json(result);
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.post("/rooms", async (req, res) => {
  try {
    const { venueId, name, type, capacity, pricePerNight, floor, amenities } = req.body;
    if (!venueId || !name || !type || !capacity || !pricePerNight) return res.status(400).json({ error: "Required fields missing" });
    const [row] = await db.insert(roomsTable).values({
      venueId, name, type, capacity, pricePerNight: pricePerNight.toString(),
      floor: floor ?? null, amenities: amenities ?? null, status: "available",
    }).returning();
    const [venue] = await db.select().from(venuesTable).where(eq(venuesTable.id, row.venueId)).limit(1);
    return res.status(201).json(fmt(row, venue?.name));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/rooms/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(roomsTable).where(eq(roomsTable.id, Number(req.params.id))).limit(1);
    if (!row) return res.status(404).json({ error: "Not found" });
    const [venue] = await db.select().from(venuesTable).where(eq(venuesTable.id, row.venueId)).limit(1);
    return res.json(fmt(row, venue?.name));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.patch("/rooms/:id", async (req, res) => {
  try {
    const updates = req.body;
    if (updates.pricePerNight) updates.pricePerNight = updates.pricePerNight.toString();
    const [row] = await db.update(roomsTable).set({ ...updates, updatedAt: new Date() }).where(eq(roomsTable.id, Number(req.params.id))).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    const [venue] = await db.select().from(venuesTable).where(eq(venuesTable.id, row.venueId)).limit(1);
    return res.json(fmt(row, venue?.name));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.delete("/rooms/:id", async (req, res) => {
  try {
    await db.delete(roomsTable).where(eq(roomsTable.id, Number(req.params.id)));
    return res.status(204).send();
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

export default router;
