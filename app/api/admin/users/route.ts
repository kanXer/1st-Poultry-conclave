import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getAuth, isSuperAdmin, isSuperAdminEmail, hashPassword } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const payload = await getAuth()
  if (!payload || !(await isSuperAdmin(payload.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const db = await getDb()
    const users = await db
      .collection("users")
      .find({ $or: [{ role: "admin" }] })
      .project({ password: 0 })
      .sort({ createdAt: 1 })
      .toArray()
    const admins = users.map((u: any) => ({
      id: u._id.toString(),
      name: u.name || u.email.split("@")[0],
      email: u.email,
      role: u.role || "admin",
      isSuperAdmin: isSuperAdminEmail(u.email),
      createdAt: u.createdAt || "",
    }))
    return NextResponse.json({ users: admins })
  } catch (e) {
    console.error("Admin list error:", e)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const payload = await getAuth()
  if (!payload || !(await isSuperAdmin(payload.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { email, name, password } = await req.json()
    const em = String(email || "").trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 })
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const db = await getDb()
    const existing = await db.collection("users").findOne({ email: em })
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists. Use edit to change it." }, { status: 409 })
    }

    const hashed = await hashPassword(password)
    await db.collection("users").insertOne({
      name: (name || em.split("@")[0]).trim(),
      email: em,
      password: hashed,
      role: "admin",
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, message: `${em} added as admin. They can now login.` })
  } catch (e) {
    console.error("Admin add error:", e)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const payload = await getAuth()
  if (!payload || !(await isSuperAdmin(payload.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id, name, password } = await req.json()
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 })
    }

    const db = await getDb()
    const target = await db.collection("users").findOne({ _id: new ObjectId(id) })
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 })
    if (isSuperAdminEmail(target.email)) {
      return NextResponse.json({ error: "The owner (super admin) cannot be edited here. Use Change Password." }, { status: 400 })
    }

    const update: any = {}
    if (name && name.trim()) update.name = name.trim()
    if (password) {
      if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
      update.password = await hashPassword(password)
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
    }

    await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: update })
    return NextResponse.json({ success: true, message: "Admin updated successfully." })
  } catch (e) {
    console.error("Admin edit error:", e)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const payload = await getAuth()
  if (!payload || !(await isSuperAdmin(payload.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 })
    }

    const db = await getDb()
    const target = await db.collection("users").findOne({ _id: new ObjectId(id) })
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 })
    if (isSuperAdminEmail(target.email)) {
      return NextResponse.json({ error: "The owner (super admin) cannot be deleted." }, { status: 400 })
    }
    if (target._id.toString() === payload.id) {
      return NextResponse.json({ error: "You cannot delete yourself." }, { status: 400 })
    }

    await db.collection("users").deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true, message: `Removed ${target.email} from admins.` })
  } catch (e) {
    console.error("Admin delete error:", e)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}