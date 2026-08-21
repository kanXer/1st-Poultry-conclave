import nodemailer from "nodemailer"

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  })
}

// ─── 1. Registration Confirmation (sent to registrant on successful signup) ───

export async function sendRegistrationConfirmation(details: {
  name: string
  email: string
  occupation: string
  regId: string
}) {
  if (!details.email || !process.env.SMTP_EMAIL || !process.env.SMTP_PASS) return

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
      <div style="background:linear-gradient(135deg,#0b1e36,#08162a);padding:24px 32px;text-align:center">
        <div style="font-size:40px;margin-bottom:8px">🎉</div>
        <h1 style="color:#fff;margin:0;font-size:20px">Registration Confirmed!</h1>
        <p style="color:#e9c873;margin:6px 0 0;font-size:13px">1st Poultry Conclave Gorakhpur 2026</p>
      </div>
      <div style="padding:24px 32px">
        <p style="font-size:14px;color:#475569;margin:0 0 16px">Dear <strong style="color:#1e293b">${details.name}</strong>,</p>
        <p style="font-size:14px;color:#475569;margin:0 0 16px">
          Your registration as <strong>${details.occupation}</strong> for the <strong>1st Poultry Conclave Gorakhpur</strong> has been successfully received. 🐔
        </p>
        <div style="padding:16px;background:#fefce8;border-radius:8px;border:1px solid #fde68a;font-size:13px;color:#92400e;margin-bottom:16px">
          <strong>📅 Event Details:</strong><br>
          <strong>Date:</strong> Sunday, 23 August 2026<br>
          <strong>Venue:</strong> Baba Gambhirnath Auditorium, Taramandal, Gorakhpur
        </div>
        <div style="padding:14px 16px;background:#f0f9ff;border-radius:8px;border:1px solid #bae6fd;font-size:13px;color:#0369a1;margin-bottom:16px">
          🪪 <strong>Your Registration ID:</strong> <span style="font-size:16px;font-weight:700;letter-spacing:1px">${details.regId}</span><br>
          <span style="font-size:11px;color:#0284c7">Keep this ID for entry at the event venue.</span><br><br>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/id-cards/print?id=${encodeURIComponent(details.regId)}" style="display:inline-block;padding:8px 16px;background:#0369a1;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;margin-top:4px;">📥 Download ID Card</a>
        </div>
        <div style="padding:16px;background:#f0fdfa;border-radius:8px;border:1px solid #99f6e4;font-size:13px;color:#0f766e;margin-bottom:16px">
          ✅ Our team will contact you with further details closer to the event.
        </div>
        <p style="font-size:13px;color:#64748b;margin:0">For any queries, call us at <a href="tel:+919336212329" style="color:#0d9488;text-decoration:none;font-weight:600">+91 9336212329</a>.</p>
      </div>
      <div style="background:#f1f5f9;padding:16px 32px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0">
        1st Poultry Conclave Gorakhpur — Edition 2026 • Sunday, 23 August 2026 • Baba Gambhirnath Auditorium, Taramandal, Gorakhpur
      </div>
    </div>
  `

  try {
    await getTransporter().sendMail({
      from: `"1st Poultry Conclave Gorakhpur" <${process.env.SMTP_EMAIL}>`,
      to: details.email,
      subject: `🎉 Registration Confirmed [${details.regId}] — 1st Poultry Conclave Gorakhpur 2026`,
      html,
    })
  } catch (e) {
    console.error("Registration confirmation email failed:", e)
  }
}

// ─── 2. Feedback / Enquiry / Help Confirmation (sent to user when they submit a query) ───

export async function sendFeedbackConfirmation(details: {
  name: string
  email: string
  subject: string
  help?: boolean
}) {
  if (!details.email || details.email === "—" || !process.env.SMTP_EMAIL || !process.env.SMTP_PASS) return

  const title = details.help ? "We've Received Your Help Request!" : "We've Received Your Enquiry!"
  const subj = details.help
    ? "🛟 Help Request Received — 1st Poultry Conclave Gorakhpur"
    : "📩 Enquiry Received — 1st Poultry Conclave Gorakhpur"

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
      <div style="background:linear-gradient(135deg,#0b1e36,#08162a);padding:24px 32px;text-align:center">
        <div style="font-size:40px;margin-bottom:8px">${details.help ? "🛟" : "📩"}</div>
        <h1 style="color:#fff;margin:0;font-size:20px">${title}</h1>
        <p style="color:#e9c873;margin:6px 0 0;font-size:13px">1st Poultry Conclave Gorakhpur 2026</p>
      </div>
      <div style="padding:24px 32px">
        <p style="font-size:14px;color:#475569;margin:0 0 16px">Dear <strong style="color:#1e293b">${details.name}</strong>,</p>
        <p style="font-size:14px;color:#475569;margin:0 0 16px">
          Thank you for reaching out to <strong>1st Poultry Conclave Gorakhpur</strong>. We have received your request regarding <strong>"${details.subject}"</strong>.
        </p>
        <div style="padding:16px;background:#f0fdfa;border-radius:8px;border:1px solid #99f6e4;font-size:13px;color:#0f766e;margin-bottom:16px">
          📞 Our team will review your request and get back to you shortly.
        </div>
        <p style="font-size:13px;color:#64748b;margin:0">For urgent assistance, call us directly at <a href="tel:+919336212329" style="color:#0d9488;text-decoration:none;font-weight:600">+91 9336212329</a>.</p>
      </div>
      <div style="background:#f1f5f9;padding:16px 32px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0">
        1st Poultry Conclave Gorakhpur — Edition 2026 • Sunday, 23 August 2026 • Baba Gambhirnath Auditorium, Taramandal, Gorakhpur
      </div>
    </div>
  `

  try {
    await getTransporter().sendMail({
      from: `"1st Poultry Conclave Gorakhpur" <${process.env.SMTP_EMAIL}>`,
      to: details.email,
      subject: subj,
      html,
    })
  } catch (e) {
    console.error("Feedback confirmation email failed:", e)
  }
}

// ─── 3. Enquiry Completed Notification (sent when admin marks enquiry as resolved) ───
export async function sendEnquiryCompletedNotification(details: {
  name: string
  email: string
  subject: string
  message: string
}) {
  if (!details.email || details.email === "—" || !process.env.SMTP_EMAIL || !process.env.SMTP_PASS) return

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
      <div style="background:linear-gradient(135deg,#0b1e36,#08162a);padding:24px 32px;text-align:center">
        <div style="font-size:40px;margin-bottom:8px">✅</div>
        <h1 style="color:#fff;margin:0;font-size:20px">Your Enquiry Has Been Resolved!</h1>
      </div>
      <div style="padding:24px 32px">
        <p style="font-size:14px;color:#475569;margin:0 0 16px">Dear <strong style="color:#1e293b">${details.name}</strong>,</p>
        <p style="font-size:14px;color:#475569;margin:0 0 16px">Thank you for reaching out to <strong>1st Poultry Conclave Gorakhpur</strong>.</p>
        <p style="font-size:14px;color:#475569;margin:0 0 16px">Your enquiry regarding <strong>"${details.subject}"</strong> has been reviewed and resolved by our team.</p>
        ${details.message && details.message !== "—" ? `<div style="padding:16px;background:#f0fdfa;border-radius:8px;border:1px solid #99f6e4;font-size:13px;color:#0f766e;margin-bottom:16px">
          <strong>Your enquiry:</strong><br>${details.message}
        </div>` : ""}
        <p style="font-size:13px;color:#64748b;margin:0">If you have any further questions, feel free to call us at <a href="tel:+919336212329" style="color:#0d9488;text-decoration:none;font-weight:600">+91 9336212329</a>.</p>
      </div>
      <div style="background:#f1f5f9;padding:16px 32px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0">
        1st Poultry Conclave Gorakhpur — Edition 2026 • Sunday, 23 August 2026 • Baba Gambhirnath Auditorium, Taramandal, Gorakhpur
      </div>
    </div>
  `

  try {
    await getTransporter().sendMail({
      from: `"1st Poultry Conclave Gorakhpur" <${process.env.SMTP_EMAIL}>`,
      to: details.email,
      subject: "✅ Enquiry Resolved — 1st Poultry Conclave Gorakhpur",
      html,
    })
  } catch (e) {
    console.error("Enquiry completed notification failed:", e)
  }
}

// ─── 4. ID Card PDF (A6 landscape, attached as <regId> <name>.pdf) ───

export function idCardPdfFilename(regId: string): string {
  const safeId = String(regId || "ID")
    .replace(/[\\/:*?"<>|\s]+/g, "")
    .trim()
  return `${safeId}.pdf`
}


export async function sendIdCardEmail(details: {
  name: string
  email: string
  occupation: string
  regId: string
  pdf: Buffer
}) {
  if (!details.email || details.email === "—" || !process.env.SMTP_EMAIL || !process.env.SMTP_PASS) return false

  const filename = idCardPdfFilename(details.regId)
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
      <div style="background:linear-gradient(135deg,#0b1e36,#08162a);padding:24px 32px;text-align:center">
        <div style="font-size:40px;margin-bottom:8px">🪪</div>
        <h1 style="color:#fff;margin:0;font-size:20px">Your ID Card is Ready!</h1>
        <p style="color:#e9c873;margin:6px 0 0;font-size:13px">1st Poultry Conclave Gorakhpur 2026</p>
      </div>
      <div style="padding:24px 32px">
        <p style="font-size:14px;color:#475569;margin:0 0 16px">Dear <strong style="color:#1e293b">${details.name}</strong>,</p>
        <p style="font-size:14px;color:#475569;margin:0 0 16px">
          Your attendee ID card is attached to this email as <strong>${filename}</strong> (A6 landscape).
          Please print it and carry it to the venue for entry.
        </p>
        <div style="padding:16px;background:#fefce8;border-radius:8px;border:1px solid #fde68a;font-size:13px;color:#92400e;margin-bottom:16px">
          <strong>📅 Event Details:</strong><br>
          <strong>Date:</strong> Sunday, 23 August 2026<br>
          <strong>Venue:</strong> Baba Gambhirnath Auditorium, Taramandal, Gorakhpur
        </div>
        <div style="padding:14px 16px;background:#f0f9ff;border-radius:8px;border:1px solid #bae6fd;font-size:13px;color:#0369a1;margin-bottom:16px">
          🪪 <strong>Your Registration ID:</strong> <span style="font-size:16px;font-weight:700;letter-spacing:1px">${details.regId}</span>
        </div>
        <p style="font-size:13px;color:#64748b;margin:0">For any queries, call us at <a href="tel:+919336212329" style="color:#0d9488;text-decoration:none;font-weight:600">+91 9336212329</a>.</p>
      </div>
      <div style="background:#f1f5f9;padding:16px 32px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0">
        1st Poultry Conclave Gorakhpur — Edition 2026 • Sunday, 23 August 2026 • Baba Gambhirnath Auditorium, Taramandal, Gorakhpur
      </div>
    </div>
  `

  try {
    await getTransporter().sendMail({
      from: `"1st Poultry Conclave Gorakhpur" <${process.env.SMTP_EMAIL}>`,
      to: details.email,
      subject: `🪪 Your ID Card [${details.regId}] — 1st Poultry Conclave Gorakhpur 2026`,
      html,
      attachments: [
        {
          filename,
          content: details.pdf,
          contentType: "application/pdf",
        },
      ],
    })
    return true
  } catch (e) {
    console.error("ID card email failed:", e)
    return false
  }
}
