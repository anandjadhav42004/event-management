import { Router } from "express";
import { db } from "@workspace/db";
import { decorTable } from "@workspace/db";
import { eq, ilike } from "drizzle-orm";

const router = Router();

function fmt(d: typeof decorTable.$inferSelect) {
  return {
    id: d.id, name: d.name, category: d.category,
    description: d.description ?? null,
    pricePerUnit: Number(d.pricePerUnit),
    available: d.available,
    imageUrl: d.imageUrl ?? null, tags: d.tags ?? null,
    createdAt: d.createdAt.toISOString(),
  };
}

router.get("/decor", async (req, res) => {
  try {
    const { category, search } = req.query as Record<string, string>;
    let rows;
    if (category) rows = await db.select().from(decorTable).where(eq(decorTable.category, category));
    else if (search) rows = await db.select().from(decorTable).where(ilike(decorTable.name, `%${search}%`));
    else rows = await db.select().from(decorTable);
    return res.json(rows.map(fmt));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.post("/decor", async (req, res) => {
  try {
    const { name, category, description, pricePerUnit, imageUrl, tags } = req.body;
    if (!name || !category || pricePerUnit === undefined) return res.status(400).json({ error: "Required fields missing" });
    const [row] = await db.insert(decorTable).values({
      name, category, description: description ?? null,
      pricePerUnit: pricePerUnit.toString(), available: true,
      imageUrl: imageUrl ?? null, tags: tags ?? null,
    }).returning();
    return res.status(201).json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/decor/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(decorTable).where(eq(decorTable.id, Number(req.params.id))).limit(1);
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.patch("/decor/:id", async (req, res) => {
  try {
    const updates = req.body;
    if (updates.pricePerUnit) updates.pricePerUnit = updates.pricePerUnit.toString();
    const [row] = await db.update(decorTable).set({ ...updates, updatedAt: new Date() }).where(eq(decorTable.id, Number(req.params.id))).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.delete("/decor/:id", async (req, res) => {
  try {
    await db.delete(decorTable).where(eq(decorTable.id, Number(req.params.id)));
    return res.status(204).send();
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

export default router;
