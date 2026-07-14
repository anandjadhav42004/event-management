import { Router } from "express";
import { db } from "../database";
import { activityTable, usersTable } from "../database";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/activity", async (req, res) => {
  try {
    const limit = Number((req.query as Record<string, string>).limit) || 20;
    const rows = await db.select().from(activityTable).orderBy(desc(activityTable.createdAt)).limit(limit);
    const result = await Promise.all(rows.map(async (r) => {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, r.userId)).limit(1);
      return {
        id: r.id, action: r.action, entity: r.entity, entityId: r.entityId,
        entityTitle: r.entityTitle ?? null, userId: r.userId,
        userName: user?.name ?? "Unknown", createdAt: r.createdAt.toISOString(),
      };
    }));
    return res.json(result);
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

export default router;
