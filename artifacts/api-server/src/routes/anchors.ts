import { Router } from "express";
import { db } from "@workspace/db";
import { anchorsTable } from "@workspace/db";
import { eq, ilike } from "drizzle-orm";

const router = Router();

function fmt(a: typeof anchorsTable.$inferSelect) {
  return {
    id: a.id, name: a.name, specialization: a.specialization,
    phone: a.phone, email: a.email ?? null,
    experience: a.experience ?? null, languages: a.languages ?? null,
    rating: a.rating ? Number(a.rating) : null,
    fee: a.fee ? Number(a.fee) : null, status: a.status,
    bio: a.bio ?? null, imageUrl: a.imageUrl ?? null,
    totalEvents: a.totalEvents ?? null, createdAt: a.createdAt.toISOString(),
  };
}

router.get("/anchors", async (req, res) => {
  try {
    const { search, available } = req.query as Record<string, string>;
    let rows;
    if (available === "true") rows = await db.select().from(anchorsTable).where(eq(anchorsTable.status, "available"));
    else if (search) rows = await db.select().from(anchorsTable).where(ilike(anchorsTable.name, `%${search}%`));
    else rows = await db.select().from(anchorsTable);
    return res.json(rows.map(fmt));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.post("/anchors", async (req, res) => {
  try {
    const { name, specialization, phone, email, experience, languages, fee, bio, imageUrl } = req.body;
    if (!name || !specialization || !phone) return res.status(400).json({ error: "Required fields missing" });
    const [row] = await db.insert(anchorsTable).values({
      name, specialization, phone, email: email ?? null,
      experience: experience ?? null, languages: languages ?? null,
      fee: fee?.toString() ?? null, bio: bio ?? null, imageUrl: imageUrl ?? null,
      status: "available",
    }).returning();
    return res.status(201).json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/anchors/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(anchorsTable).where(eq(anchorsTable.id, Number(req.params.id))).limit(1);
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.patch("/anchors/:id", async (req, res) => {
  try {
    const updates = req.body;
    if (updates.fee) updates.fee = updates.fee.toString();
    if (updates.rating) updates.rating = updates.rating.toString();
    const [row] = await db.update(anchorsTable).set({ ...updates, updatedAt: new Date() }).where(eq(anchorsTable.id, Number(req.params.id))).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

export default router;
