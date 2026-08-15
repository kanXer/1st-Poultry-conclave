import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { hashPassword, isAdminEmail } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    if (!isAdminEmail(email)) {
      return NextResponse.json({ error: "Only authorized emails can register" }, { status: 403 })
    }

    const db = await getDb()
    const existing = await db.collection("users").findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const hashed = await hashPassword(password)
    await db.collection("users").insertOne({
      name: name || email.split("@")[0],
      email: email.toLowerCase(),
      password: hashed,
      role: "admin",
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, message: "Registration successful. Please login." })
  } catch (e) {
    console.error("Register error:", e)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
