import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { cookies } from "next/headers"
import { getDb } from "./mongodb"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production"
const TOKEN_NAME = "token"
const ADMIN_EMAIL = process.env.ADMIN_SECRET_EMAIL || ""

export interface JwtPayload {
  id: string
  email: string
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

export async function getTokenFromCookies(): Promise<string | undefined> {
  return (await cookies()).get(TOKEN_NAME)?.value
}

export async function getAuth(): Promise<JwtPayload | null> {
  const token = await getTokenFromCookies()
  if (!token) return null
  return verifyToken(token)
}

export function isAdminEmail(email: string): boolean {
  return isSuperAdminEmail(email)
}

/** Super admin = the owner email set in .env (ADMIN_SECRET_EMAIL). */
export function isSuperAdminEmail(email: string): boolean {
  return ADMIN_EMAIL.length > 0 && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
}

export async function getUserRole(userId: string): Promise<"admin" | "user"> {
  try {
    const db = await getDb()
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
    if (!user) return "user"
    // Admin if super admin (env email) OR explicitly given role "admin" by a super admin
    return isSuperAdminEmail(user.email) || user.role === "admin" ? "admin" : "user"
  } catch {
    return "user"
  }
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  return (await getUserRole(userId)) === "admin"
}

/** True if the given user id belongs to the .env owner email (Super Admin). */
export async function isSuperAdmin(userId: string): Promise<boolean> {
  try {
    const db = await getDb()
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
    return !!user && isSuperAdminEmail(user.email)
  } catch {
    return false
  }
}

/**
 * Creates a server-signed HMAC proof that the given userId is admin.
 * This prevents response-interception attacks where someone flips isAdmin to true
 * via a proxy — without the matching proof, the client won't grant admin UI access.
 */
export function signAdminProof(userId: string): string {
  const hmac = crypto.createHmac("sha256", JWT_SECRET)
  hmac.update(`admin:${userId}`)
  return hmac.digest("hex")
}

/**
 * Verifies that the admin proof matches the given userId.
 */
export function verifyAdminProof(userId: string, proof: string): boolean {
  const expected = signAdminProof(userId)
  // Timing-safe comparison to prevent timing attacks
  if (expected.length !== proof.length) return false
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(proof))
}
