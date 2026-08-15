import { NextRequest, NextResponse } from "next/server"
import { getRegistrationByRegId, Registration } from "@/lib/storage"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 })
  }

  try {
    const db = await getDb()
    let record: Registration | null = null

    // Check if it's a MongoDB ObjectId
    if (ObjectId.isValid(id)) {
      const doc = await db.collection<Registration>("registrations").findOne({ _id: new ObjectId(id) })
      if (doc) {
        record = { ...doc, _id: doc._id.toString() } as Registration
      }
    } 
    
    // Check if it's regId (FPC-GKP-XXX) or legacy id (REG-...)
    if (!record) {
      const doc = await db.collection<Registration>("registrations").findOne({
        $or: [{ regId: id }, { id: id }]
      })
      if (doc) {
        record = { ...doc, _id: doc._id.toString() } as Registration
      }
    }

    if (!record) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    // Return only necessary fields for the ID card to prevent leaking sensitive info (phone/email) to public
    return NextResponse.json({
      registration: {
        _id: record.id, // Keep the structure expected by frontend
        id: record.id,
        regId: record.regId,
        name: record.name,
        occupation: record.occupation,
        // Omit phone and email for privacy since this endpoint is public
        phone: "",
        email: "",
        timestamp: record.timestamp
      }
    })
  } catch (e) {
    console.error("Single registration fetch error:", e)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
