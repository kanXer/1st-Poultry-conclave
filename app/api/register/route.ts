import { NextRequest, NextResponse } from "next/server"
import { saveRegistration } from "@/lib/storage"
import { verifyCaptcha } from "@/lib/captcha"
import { rateLimit } from "@/lib/rateLimit"
import { sendTelegramNotification } from "@/lib/telegram"
import { sendRegistrationConfirmation, sendIdCardEmail } from "@/lib/email"
import { generateIdCardPdf } from "@/lib/idCardPdf"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, occupation, phone, email, captchaId, captchaAnswer } = body

    if (!name || !String(name).trim()) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 })
    }
    if (!occupation || !String(occupation).trim()) {
      return NextResponse.json({ error: "Occupation is required." }, { status: 400 })
    }
    if (!phone || !String(phone).trim()) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 })
    }

    // Rate limiting per IP
    const limit = rateLimit(request.headers, 5, 15 * 60 * 1000)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${limit.retryAfterSeconds} seconds.` },
        { status: 429 }
      )
    }

    // Captcha verification
    if (!verifyCaptcha(String(captchaId || ""), String(captchaAnswer || ""))) {
      return NextResponse.json({ error: "Captcha verification failed. Please try again." }, { status: 400 })
    }

    const timestamp = new Date().toISOString()

    const record = await saveRegistration({
      name: String(name).trim(),
      occupation: String(occupation).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : "",
      timestamp,
    })

    await Promise.allSettled([
      sendTelegramNotification({
        id: record.regId,
        name: record.name,
        phone: record.phone,
        email: record.email || "—",
        condition: `[REGISTRATION] ${record.occupation}`,
        date: "N/A",
        time: "N/A",
        message: `New conclave registration. ID: ${record.regId} | Occupation: ${record.occupation} | Event: Sunday, 23 August 2026, Baba Gambhirnath Auditorium, Taramandal, Gorakhpur`,
        timestamp,
      }),
      record.email
        ? sendRegistrationConfirmation({
            name: record.name,
            email: record.email,
            occupation: record.occupation,
            regId: record.regId,
          })
        : Promise.resolve(),
      record.email
        ? (async () => {
            try {
              const siteUrl =
                process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://poultryconclave.in"
              const pdf = await generateIdCardPdf(
                { name: record.name, occupation: record.occupation, regId: record.regId },
                { siteUrl }
              )
              await sendIdCardEmail({
                name: record.name,
                email: record.email,
                occupation: record.occupation,
                regId: record.regId,
                pdf,
              })
            } catch (e) {
              console.error("ID card auto-email failed:", e)
            }
          })()
        : Promise.resolve(),
    ])

    return NextResponse.json({
      success: true,
      id: record.id,
      regId: record.regId,
      message: `Thank you! Your registration has been confirmed. Your ID is ${record.regId}. Our team will contact you shortly.`,
    })
  } catch (e) {
    console.error("Registration error:", e)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}