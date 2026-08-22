import { ObjectId } from "mongodb"
import { getDb } from "./mongodb"

export interface Enquiry {
  id: string
  name: string
  phone: string
  email: string
  subject: string
  message: string
  timestamp: string
  source: string
  kind?: "help" | "enquiry"
  status?: "pending" | "completed"
}

export async function saveEnquiry(
  enquiry: Omit<Enquiry, "id" | "status">
): Promise<Enquiry> {
  const db = await getDb()

  const record: Enquiry = {
    ...enquiry,
    id: `ENQ-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    status: "pending",
  }

  await db.collection("enquiries").insertOne(record)
  return record
}

export interface Feedback {
  id: string
  name: string
  rating: number
  category: string
  comment: string
  timestamp: string
  source: string
  status?: "pending" | "completed"
}

export async function saveFeedback(
  feedback: Omit<Feedback, "id" | "status">
): Promise<Feedback> {
  const db = await getDb()

  const record: Feedback = {
    ...feedback,
    id: `FDB-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    status: "pending",
  }

  await db.collection("feedback").insertOne(record)
  return record
}

export async function getFeedback(): Promise<Feedback[]> {
  const db = await getDb()
  return db
    .collection<Feedback>("feedback")
    .find({})
    .sort({ timestamp: -1 })
    .toArray()
}

export async function markFeedbackResolved(id: string): Promise<Feedback | null> {
  const db = await getDb()
  const result = await db.collection("feedback").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { status: "completed" } },
    { returnDocument: "after" }
  )
  return result as unknown as Feedback | null
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const db = await getDb()
  return db
    .collection<Enquiry>("enquiries")
    .find({})
    .sort({ timestamp: -1 })
    .toArray()
}

export async function markEnquiryCompleted(id: string): Promise<Enquiry | null> {
  const db = await getDb()
  const result = await db.collection("enquiries").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { status: "completed" } },
    { returnDocument: "after" }
  )
  return result as unknown as Enquiry | null
}

export interface Registration {
  id: string      // internal mongo id (legacy)
  regId: string   // FPC-GKP-001 format (display ID)
  name: string
  occupation: string
  phone: string
  email: string
  timestamp: string
}

/** Returns next sequential number for FPC-GKP-XXX using atomic MongoDB counter */
async function getNextRegSequence(): Promise<number> {
  const db = await getDb()
  const result = await db.collection("counters").findOneAndUpdate(
    { _id: "registrations" as unknown as ObjectId },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" }
  )
  return (result as unknown as { seq: number }).seq
}

export async function saveRegistration(
  reg: Omit<Registration, "id" | "regId">
): Promise<Registration> {
  const db = await getDb()
  const seq = await getNextRegSequence()
  const paddedSeq = String(seq).padStart(3, "0")

  const record: Registration = {
    ...reg,
    id: `REG-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    regId: `FPC-GKP-${paddedSeq}`,
  }

  await db.collection("registrations").insertOne(record)
  return record
}

export async function getRegistrations(): Promise<Registration[]> {
  const db = await getDb()
  return db
    .collection<Registration>("registrations")
    .find({})
    .sort({ timestamp: -1 })
    .toArray()
}

export async function deleteRegistration(id: string): Promise<void> {
  const db = await getDb()
  await db.collection("registrations").deleteOne({ _id: new ObjectId(id) })
}

export async function getRegistrationByRegId(regId: string): Promise<Registration | null> {
  const db = await getDb()
  const record = await db.collection<Registration>("registrations").findOne({ regId })
  return record ? { ...record, _id: record._id.toString() } as Registration : null
}

export const REGISTRATION_OPEN_KEY = "registrationOpen"

/**
 * Returns whether public event registration is currently open.
 * Defaults to true (open) when no setting exists yet.
 */
export async function getRegistrationOpen(): Promise<boolean> {
  try {
    const db = await getDb()
    const doc = await db
      .collection<{ _id: string; value: boolean; updatedAt?: string }>("settings")
      .findOne({ _id: REGISTRATION_OPEN_KEY })
    if (!doc) return true
    return doc.value !== false
  } catch {
    return true
  }
}

/**
 * Persists the public registration open/closed state.
 */
export async function setRegistrationOpen(open: boolean): Promise<boolean> {
  const db = await getDb()
  await db
    .collection<{ _id: string; value: boolean; updatedAt?: string }>("settings")
    .updateOne(
      { _id: REGISTRATION_OPEN_KEY },
      { $set: { value: !!open, updatedAt: new Date().toISOString() } },
      { upsert: true }
    )
  return !!open
}