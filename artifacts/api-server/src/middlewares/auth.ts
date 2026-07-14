import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Augment Express Request interface to include the authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

// Fallback JWT secret for development
const JWT_SECRET = process.env.JWT_SECRET || "rika_jwt_secret_default_2026";

if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  console.warn("WARNING: JWT_SECRET environment variable is not set in production. Using default fallback!");
}

export interface DecodedUser {
  userId: number;
  role: string;
}

/**
 * Reusable Express middleware to verify JWT tokens
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Access denied. Token missing." });
    return;
  }

  const token = authHeader.slice(7).trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & DecodedUser;
    
    if (!decoded.userId || !decoded.role) {
      res.status(401).json({ error: "Access denied. Invalid token payload." });
      return;
    }

    req.user = {
      id: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Access denied. Token has expired." });
      return;
    }
    res.status(401).json({ error: "Access denied. Invalid token." });
    return;
  }
}
