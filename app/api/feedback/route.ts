import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongodb"
import { saveFeedback, markFeedbackResolved } from "@/lib/storage"
import { verifyToken, getTokenFromCookies, isUserAdmin } from "@/lib/auth"
import { sendTelegramNotification } from "@/lib/telegram"

async function checkAdmin(): Promise<boolean> {
  const tokenStr = await getTokenFromCookies()
  const payload = tokenStr ? verifyToken(tokenStr) : null
  return !!payload && (await isUserAdmin(payload.id))
}

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const db = await getDb()
    const feedback = await db.collection("feedback").find({}).sort({ timestamp: -1 }).toArray()
    const sanitized = feedback.map(({ _id, ...rest }) => ({ ...rest, _id: _id.toString() }))
    return NextResponse.json({ feedback: sanitized })
  } catch (e) {
    console.error("Feedback fetch error:", e)
    return NextResponse.json({ feedback: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, rating, category, comment } = await request.json()

    if (!name || !rating) {
      return NextResponse.json(
        { error: "Name and rating are required." },
        { status: 400 }
      )
    }
    const stars = Math.min(5, Math.max(1, Math.round(Number(rating))))
    if (isNaN(stars)) {
      return NextResponse.json({ error: "Invalid rating." }, { status: 400 })
    }

    const timestamp = new Date().toISOString()

    const record = await saveFeedback({
      name: String(name).trim(),
      rating: stars,
      category: String(category || "General").trim(),
      comment: String(comment || "").trim(),
      timestamp,
      source: "1st Poultry Conclave Gorakhpur Website (Feedback Form)",
    })

    await Promise.allSettled([
      sendTelegramNotification({
        id: record.id,
        name: record.name,
        phone: "N/A",
        email: "N/A",
        condition: `[FEEDBACK] ${record.rating}★ — ${record.category}`,
        date: "N/A",
        time: "N/A",
        message: record.comment || record.category,
        timestamp,
      }),
    ])

    return NextResponse.json({
      success: true,
      id: record.id,
      message: "Thank you! Your feedback has been submitted.",
    })
  } catch (e) {
    console.error("Feedback create error:", e)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await request.json()
    const updated = await markFeedbackResolved(id)
    if (!updated) return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
    return NextResponse.json({ success: true, message: "Feedback marked as resolved." })
  } catch (e) {
    console.error("Feedback resolve error:", e)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

    const db = await getDb()
    await db.collection("feedback").deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}