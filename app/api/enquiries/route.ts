import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongodb"
import { verifyToken, getTokenFromCookies, isUserAdmin } from "@/lib/auth"
import { markEnquiryCompleted } from "@/lib/storage"
import { sendEnquiryCompletedNotification } from "@/lib/email"

async function checkAdmin(payload: { id: string } | null): Promise<boolean> {
  return !!payload && await isUserAdmin(payload.id)
}

export async function GET() {
  const tokenStr = await getTokenFromCookies()
  const payload = tokenStr ? verifyToken(tokenStr) : null
  if (!await checkAdmin(payload)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const db = await getDb()
    const enquiries = await db
      .collection("enquiries")
      .find({})
      .sort({ timestamp: -1 })
      .toArray()

    const sanitized = enquiries.map(({ _id, ...rest }) => ({ ...rest, _id: _id.toString() }))
    return NextResponse.json({ enquiries: sanitized })
  } catch (e) {
    console.error("Enquiries fetch error:", e)
    return NextResponse.json({ enquiries: [] })
  }
}

export async function PATCH(req: NextRequest) {
  const tokenStr = await getTokenFromCookies()
  const payload = tokenStr ? verifyToken(tokenStr) : null
  if (!await checkAdmin(payload)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

    const updated = await markEnquiryCompleted(id)
    if (!updated) return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })

    await sendEnquiryCompletedNotification({
      name: updated.name,
      email: updated.email,
      subject: updated.subject,
      message: updated.message,
    })

    return NextResponse.json({ success: true, message: "Enquiry marked as completed. Customer notified via email." })
  } catch (e) {
    console.error("Enquiry complete error:", e)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const tokenStr = await getTokenFromCookies()
  const payload = tokenStr ? verifyToken(tokenStr) : null
  if (!await checkAdmin(payload)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

    const db = await getDb()
    await db.collection("enquiries").deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
