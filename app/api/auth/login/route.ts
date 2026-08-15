import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { verifyPassword, signToken, isSuperAdminEmail, signAdminProof } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const db = await getDb()
    const user = await db.collection("users").findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isAdmin = isSuperAdminEmail(user.email) || user.role === "admin"
    const isSuper = isSuperAdminEmail(user.email)
    const payload = { id: user._id.toString(), email: user.email }
    const token = signToken(payload)

    const res = NextResponse.json({
      user: {
        id: payload.id,
        email: user.email,
        name: user.name,
        isAdmin,
        isSuperAdmin: isSuper,
        ...(isAdmin ? { adminProof: signAdminProof(payload.id) } : {}),
      },
    })
    res.cookies.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 7 * 86400 })
    return res
  } catch (e) {
    console.error("Login error:", e)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
