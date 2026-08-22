import { NextRequest, NextResponse } from "next/server"
import { verifyToken, getTokenFromCookies, isUserAdmin } from "@/lib/auth"
import { getRegistrationByRegId } from "@/lib/storage"
import { generateIdCardPdf } from "@/lib/idCardPdf"
import { sendIdCardEmail, idCardPdfFilename } from "@/lib/email"

async function checkAdmin(): Promise<boolean> {
  const tokenStr = await getTokenFromCookies()
  if (!tokenStr) return false
  const payload = verifyToken(tokenStr)
  return payload ? await isUserAdmin(payload.id) : false
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const id = String(body.id || "").trim()
    if (!id) {
      return NextResponse.json({ error: "Registration ID is required." }, { status: 400 })
    }

    const reg = await getRegistrationByRegId(id)
    if (!reg) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 })
    }
    if (!reg.email || reg.email === "—") {
      return NextResponse.json(
        { error: "This registration has no email address, so the ID card cannot be emailed." },
        { status: 400 }
      )
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://poultryconclave.in"

    const pdf = await generateIdCardPdf(
      { name: reg.name, occupation: reg.occupation, regId: reg.regId },
      { siteUrl }
    )

    const ok = await sendIdCardEmail({
      name: reg.name,
      email: reg.email,
      occupation: reg.occupation,
      regId: reg.regId,
      pdf,
    })

    if (!ok) {
      return NextResponse.json(
        { error: "Failed to send the ID card email. Please check SMTP configuration." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `ID card PDF emailed to ${reg.email} as ${idCardPdfFilename(reg.regId, reg.name)} (A6 landscape).`,
    })
  } catch (e) {
    console.error("ID card email error:", e)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
