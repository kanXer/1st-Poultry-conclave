import { NextResponse } from "next/server"
import { getAuth, isSuperAdminEmail, signAdminProof } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  const payload = await getAuth()
  if (!payload) return NextResponse.json({ user: null })

  const db = await getDb()
  const user = await db.collection("users").findOne({ _id: new ObjectId(payload.id) })
  if (!user) return NextResponse.json({ user: null })

  const isAdmin = isSuperAdminEmail(user.email) || user.role === "admin"
  const isSuper = isSuperAdminEmail(user.email)

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      isAdmin,
      isSuperAdmin: isSuper,
      // Server-signed HMAC proof — only sent for real admins.
      // Client verifies this to prevent response-interception attacks.
      ...(isAdmin ? { adminProof: signAdminProof(user._id.toString()) } : {}),
    },
  })
}
