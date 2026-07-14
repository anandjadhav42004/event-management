import { Router } from "express";
import { db } from "../database";
import { usersTable } from "../database";
import { eq, ilike, or } from "drizzle-orm";
import * as crypto from "crypto";

const router = Router();

function fmt(u: typeof usersTable.$inferSelect) {
  return {
    id: u.id, name: u.name, email: u.email, role: u.role,
    phone: u.phone ?? null, avatar: u.avatar ?? null,
    status: u.status, createdAt: u.createdAt.toISOString(),
  };
}

function hashPassword(p: string) {
  return crypto.createHash("sha256").update(p + "rika_salt_2024").digest("hex");
}

router.get("/users", async (req, res) => {
  try {
    const { role, search } = req.query as Record<string, string>;
    let query = db.select().from(usersTable);
    const conditions = [];
    if (role) conditions.push(eq(usersTable.role, role));
    if (search) conditions.push(or(ilike(usersTable.name, `%${search}%`), ilike(usersTable.email, `%${search}%`)));
    const rows = conditions.length
      ? await db.select().from(usersTable).where(conditions.length === 1 ? conditions[0] : conditions[0])
      : await query;
    return res.json(rows.map(fmt));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.post("/users", async (req, res) => {
  try {
    const { name, email, role = "client", phone, password = "password123" } = req.body;
    if (!name || !email) return res.status(400).json({ error: "name and email required" });
    const [user] = await db.insert(usersTable).values({
      name, email, role, phone: phone ?? null,
      passwordHash: hashPassword(password), status: "active",
    }).returning();
    return res.status(201).json(fmt(user));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.get("/users/:id", async (req, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, Number(req.params.id))).limit(1);
    if (!user) return res.status(404).json({ error: "Not found" });
    return res.json(fmt(user));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.patch("/users/:id", async (req, res) => {
  try {
    const { name, phone, avatar, status, role } = req.body;
    const [user] = await db.update(usersTable)
      .set({ ...(name && { name }), ...(phone !== undefined && { phone }), ...(avatar !== undefined && { avatar }), ...(status && { status }), ...(role && { role }), updatedAt: new Date() })
      .where(eq(usersTable.id, Number(req.params.id))).returning();
    if (!user) return res.status(404).json({ error: "Not found" });
    return res.json(fmt(user));
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await db.delete(usersTable).where(eq(usersTable.id, Number(req.params.id)));
    return res.status(204).send();
  } catch (err) { req.log.error(err); return res.status(500).json({ error: "Server error" }); }
});

export default router;
