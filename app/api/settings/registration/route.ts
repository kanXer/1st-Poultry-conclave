import { NextRequest, NextResponse } from "next/server"
import { getRegistrationOpen, setRegistrationOpen } from "@/lib/storage"
import { getTokenFromCookies, verifyToken, isUserAdmin } from "@/lib/auth"

export async function GET() {
  try {
    const open = await getRegistrationOpen()
    return NextResponse.json({ open })
  } catch {
    return NextResponse.json({ open: true })
  }
}

export async function POST(req: NextRequest) {
  const tokenStr = await getTokenFromCookies()
  if (!tokenStr) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const payload = verifyToken(tokenStr)
  if (!payload || !(await isUserAdmin(payload.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const open = body.open === true || body.open === "true"
    const updated = await setRegistrationOpen(open)
    return NextResponse.json({ open: updated })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
