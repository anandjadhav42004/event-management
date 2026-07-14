import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import * as crypto from "crypto";

const router = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "rika_salt_2024").digest("hex");
}

function generateToken(userId: number, role: string): string {
  const payload = JSON.stringify({ userId, role, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  return Buffer.from(payload).toString("base64");
}

function formatUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone ?? null,
    avatar: user.avatar ?? null,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
  };
}

router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, role = "client", phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, password required" });
    }
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const [user] = await db.insert(usersTable).values({
      name,
      email,
      passwordHash: hashPassword(password),
      role,
      phone: phone ?? null,
      status: "active",
    }).returning();
    const token = generateToken(user.id, user.role);
    return res.status(201).json({ token, user: formatUser(user) });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = generateToken(user.id, user.role);
    return res.json({ token, user: formatUser(user) });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/auth/me", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
    const payload = JSON.parse(Buffer.from(auth.slice(7), "base64").toString());
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.userId)).limit(1);
    if (!user) return res.status(401).json({ error: "User not found" });
    return res.json(formatUser(user));
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
