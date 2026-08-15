import { MongoClient, type Db } from "mongodb"

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI
const DB_NAME = "poultryConclave"

let client: MongoClient | null = null
let db: Db | null = null

export async function getDb(): Promise<Db> {
  if (db) return db

  if (!MONGODB_URI) {
    throw new Error("NEXT_PUBLIC_MONGODB_URI not set in environment")
  }

  client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    family: 4,
  })
  await client.connect()
  db = client.db(DB_NAME)

  return db
}

export async function closeClient() {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}
