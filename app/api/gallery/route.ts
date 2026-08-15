import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongodb"
import { verifyToken, getTokenFromCookies, isUserAdmin } from "@/lib/auth"
import { SITE_NAME } from "@/lib/site"

async function isAdminRequest(): Promise<boolean> {
  const tokenStr = await getTokenFromCookies()
  if (!tokenStr) return false
  const payload = verifyToken(tokenStr)
  return payload ? await isUserAdmin(payload.id) : false
}

export async function GET() {
  try {
    const db = await getDb()
    const rawItems = await db.collection("gallery").find({}).sort({ order: 1, createdAt: -1 }).toArray()
    const blogVideos = await db
      .collection("blog")
      .find({ youtubeUrl: { $ne: "", $exists: true } }, { projection: { title: 1, youtubeUrl: 1, slug: 1 } })
      .toArray()

    const items = rawItems.map((doc) => {
      const d = doc as Record<string, unknown>
      return {
        _id: String(d._id),
        type: d.type as string || "",
        url: d.url as string || "",
        thumbnail: d.thumbnail as string || "",
        title: d.title as string || "",
        order: d.order as number ?? 0,
        createdAt: d.createdAt as string || "",
        starred: d.starred === true,
        source: "gallery",
      }
    })

    const videos = blogVideos.map((doc) => {
      const d = doc as Record<string, unknown>
      return {
        _id: String(d._id),
        type: "video" as const,
        url: (d.youtubeUrl as string) || "",
        title: (d.title as string) || "Video",
        youtubeUrl: (d.youtubeUrl as string) || "",
        slug: (d.slug as string) || "",
        order: 999,
        starred: false,
        source: "blog",
      }
    })

    const merged = [...items, ...videos].sort((a, b) => a.order - b.order)
    return NextResponse.json({ items: merged })
  } catch (e) {
    console.error("Gallery fetch error:", e)
    return NextResponse.json({ items: [] })
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { type, url, thumbnail, title } = await req.json()
    if (!type || !url) {
      return NextResponse.json({ error: "type and url are required" }, { status: 400 })
    }

    const db = await getDb()
    const count = await db.collection("gallery").countDocuments()
    const result = await db.collection("gallery").insertOne({
      type,
      url,
      thumbnail: thumbnail || "",
      title: title?.trim() || SITE_NAME,
      order: count,
      starred: false,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ item: { _id: result.insertedId.toString(), type, url, thumbnail: thumbnail || "", title: title?.trim() || SITE_NAME, order: count, starred: false, createdAt: new Date().toISOString(), source: "gallery" } })
  } catch (e) {
    console.error("Gallery create error:", e)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { items } = await req.json()
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "items array required" }, { status: 400 })
    }

    const db = await getDb()
    for (const item of items) {
      const update: Record<string, unknown> = {}
      if (item.order !== undefined) update.order = item.order
      if (item.starred !== undefined) update.starred = item.starred
      if (Object.keys(update).length > 0) {
        await db.collection("gallery").updateOne(
          { _id: new ObjectId(item._id) },
          { $set: update }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Gallery reorder error:", e)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    const db = await getDb()
    await db.collection("gallery").deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Gallery delete error:", e)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
