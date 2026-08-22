import { NextRequest, NextResponse } from "next/server"
import { getRegistrationByRegId } from "@/lib/storage"
import { generateIdCardPdf } from "@/lib/idCardPdf"
import { idCardPdfFilename } from "@/lib/email"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = String(searchParams.get("id") || "").trim()
    if (!id) {
      return NextResponse.json({ error: "Registration ID is required." }, { status: 400 })
    }

    const reg = await getRegistrationByRegId(id)
    if (!reg) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 })
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://poultryconclave.in"

    const pdf = await generateIdCardPdf(
      { name: reg.name, occupation: reg.occupation, regId: reg.regId },
      { siteUrl }
    )

    const filename = idCardPdfFilename(reg.regId, reg.name)

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (e) {
    console.error("ID card PDF download error:", e)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
