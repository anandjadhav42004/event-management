import { Router } from "express";
import { db } from "@workspace/db";
import { inventoryTable } from "@workspace/db";
import { eq, ilike } from "drizzle-orm";

const router = Router();

function fmt(i: typeof inventoryTable.$inferSelect) {
  return {
    id: i.id, name: i.name, category: i.category,
    quantity: i.quantity, unit: i.unit,
    minQuantity: i.minQuantity ?? null, location: i.location ?? null,
    status: i.status, unitCost: i.unitCost ? Number(i.unitCost) : null,
    description: i.description ?? null, createdAt: i.createdAt.toISOString(),
  };
}

router.get("/inventory", async (req, res) => {
  try {
    const { category, search } = req.query as Record<string, string>;
    let rows;
    if (category) rows = await db.select().from(inventoryTable).where(eq(inventoryTable.category, category));
    else if (search) rows = await db.select().from(inventoryTable).where(ilike(inventoryTable.name, `%${search}%`));
    else rows = await db.select().from(inventoryTable);
    return res.json(rows.map(fmt));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.post("/inventory", async (req, res) => {
  try {
    const { name, category, quantity, unit, minQuantity, location, unitCost, description } = req.body;
    if (!name || !category || quantity === undefined || !unit) return res.status(400).json({ error: "Required fields missing" });
    const status = quantity <= (minQuantity ?? 0) ? "low_stock" : "in_stock";
    const [row] = await db.insert(inventoryTable).values({
      name, category, quantity, unit,
      minQuantity: minQuantity ?? null, location: location ?? null,
      unitCost: unitCost?.toString() ?? null, description: description ?? null, status,
    }).returning();
    return res.status(201).json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/inventory/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(inventoryTable).where(eq(inventoryTable.id, Number(req.params.id))).limit(1);
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.patch("/inventory/:id", async (req, res) => {
  try {
    const { quantity, minQuantity, location, unitCost, status } = req.body;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (quantity !== undefined) {
      updates.quantity = quantity;
      const min = minQuantity ?? 0;
      updates.status = quantity <= min ? "low_stock" : "in_stock";
    }
    if (minQuantity !== undefined) updates.minQuantity = minQuantity;
    if (location !== undefined) updates.location = location;
    if (unitCost !== undefined) updates.unitCost = unitCost?.toString();
    if (status) updates.status = status;
    const [row] = await db.update(inventoryTable).set(updates).where(eq(inventoryTable.id, Number(req.params.id))).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

export default router;
