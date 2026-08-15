import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getAuth, verifyPassword, hashPassword } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const payload = await getAuth()
  if (!payload) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  try {
    const { currentPassword, newPassword } = await req.json()
    if (!currentPassword) {
      return NextResponse.json({ error: "Enter your current password" }, { status: 400 })
    }
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 })
    }

    const db = await getDb()
    const user = await db.collection("users").findOne({ _id: new ObjectId(payload.id) })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const valid = await verifyPassword(currentPassword, user.password)
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    const hashed = await hashPassword(newPassword)
    await db.collection("users").updateOne({ _id: user._id }, { $set: { password: hashed } })

    return NextResponse.json({ success: true, message: "Password updated successfully." })
  } catch (e) {
    console.error("Change password error:", e)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
