import { NextRequest, NextResponse } from "next/server"
import { saveEnquiry } from "@/lib/storage"
import { sendFeedbackConfirmation } from "@/lib/email"
import { sendTelegramNotification } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, subject, message, kind } = await request.json()

    if (!name || (!phone && !email)) {
      return NextResponse.json(
        { error: "Name and at least one contact method (phone or email) are required." },
        { status: 400 }
      )
    }

    const timestamp = new Date().toISOString()
    const isHelp = kind === "help"

    const record = await saveEnquiry({
      name: name.trim(),
      phone: phone || "—",
      email: email || "—",
      subject: subject || (isHelp ? "Help Request" : "General Enquiry"),
      message: message || "—",
      timestamp,
      kind: isHelp ? "help" : "enquiry",
      source: isHelp
        ? "1st Poultry Conclave Gorakhpur Website (Help Form)"
        : "1st Poultry Conclave Gorakhpur Website (Enquiry Form)",
    })

    const details = {
      id: record.id,
      name: name.trim(),
      phone: phone || "—",
      email: email || "—",
      subject: subject || (isHelp ? "Help Request" : "General Enquiry"),
      message: message || "—",
      timestamp,
    }

    await Promise.allSettled([
      sendFeedbackConfirmation({
        name: details.name,
        email: details.email,
        subject: details.subject,
        help: isHelp,
      }),
      sendTelegramNotification({
        id: details.id,
        name: details.name,
        phone: details.phone,
        email: details.email,
        condition: isHelp ? `[HELP] ${details.subject}` : `[ENQUIRY] ${details.subject}`,
        date: "N/A",
        time: "N/A",
        message: details.message,
        timestamp,
      }),
    ])

    return NextResponse.json({
      success: true,
      id: record.id,
      message: isHelp
        ? "Thank you! Your help request has been received. Our team will assist you shortly."
        : "Thank you! Your enquiry has been received. Our team will contact you shortly.",
    })
  } catch (e) {
    console.error("Enquiry error:", e)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}