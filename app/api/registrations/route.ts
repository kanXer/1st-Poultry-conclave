import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { verifyToken, getTokenFromCookies, isUserAdmin } from "@/lib/auth"
import { deleteRegistration } from "@/lib/storage"

async function checkAdmin(): Promise<boolean> {
  const tokenStr = await getTokenFromCookies()
  if (!tokenStr) return false
  const payload = verifyToken(tokenStr)
  return payload ? await isUserAdmin(payload.id) : false
}

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const db = await getDb()
    const registrations = await db
      .collection("registrations")
      .find({})
      .sort({ timestamp: -1 })
      .toArray()

    const sanitized = registrations.map(({ _id, ...rest }) => ({ ...rest, _id: _id.toString() }))
    return NextResponse.json({ registrations: sanitized })
  } catch (e) {
    console.error("Registrations fetch error:", e)
    return NextResponse.json({ registrations: [] })
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

    await deleteRegistration(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}