import { Router } from "express";
import { db } from "../database";
import { notificationsTable } from "../database";
import { eq } from "drizzle-orm";

const router = Router();

function fmt(n: typeof notificationsTable.$inferSelect) {
  return {
    id: n.id, title: n.title, message: n.message,
    type: n.type, read: n.read, link: n.link ?? null,
    createdAt: n.createdAt.toISOString(),
  };
}

router.get("/notifications", async (req, res) => {
  try {
    const { unreadOnly } = req.query as Record<string, string>;
    let rows;
    if (unreadOnly === "true") rows = await db.select().from(notificationsTable).where(eq(notificationsTable.read, false));
    else rows = await db.select().from(notificationsTable);
    return res.json(rows.map(fmt));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.patch("/notifications/:id/read", async (req, res) => {
  try {
    const { read } = req.body;
    const [row] = await db.update(notificationsTable)
      .set({ read: read ?? true })
      .where(eq(notificationsTable.id, Number(req.params.id))).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(fmt(row));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

export default router;
