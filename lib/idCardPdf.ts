import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"

export interface IdCardRegistration {
  name: string
  occupation: string
  regId: string
}

export interface IdCardPdfOptions {
  /** Absolute base URL used for QR links (e.g. https://poultryconclave.in) */
  siteUrl: string
  /** Optional preloaded logo buffer. Falls back to reading public/logo-transparent.png */
  logoBuffer?: Buffer
}

// A6 landscape = 148mm × 105mm (same as the print page).
// NOTE: we draw in POINTS, not mm — pdfkit's text measurement (heightOfString /
// widthOfString) is always point-based, so using `unit: "mm"` inflates text
// heights ~2.83x and makes doc.text() leak onto extra pages.
const PT_PER_MM = 72 / 25.4
const mm = (n: number) => n * PT_PER_MM

const W = mm(148)
const H = mm(105)

const NAVY_900 = "#0a1c33"
const NAVY_800 = "#10294a"
const NAVY_400 = "#4f84ac"
const NAVY_200 = "#aecbe1"
const GOLD = "#c98a2f"
const GOLD_LIGHT = "#e5c377"
const GOLD_MID = "#d9a94f"
const WHITE = "#ffffff"
const SLATE_100 = "#f1f5f9"
const DARK_TEXT = "#0a1c33"

function qrUrl(data: string, size: number) {
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    data
  )}&size=${size}x${size}&margin=4&color=000000&bgcolor=ffffff`
}

async function loadLogoBuffer(logoBuffer?: Buffer): Promise<Buffer | null> {
  if (logoBuffer && logoBuffer.length > 0) return logoBuffer
  try {
    const p = path.join(process.cwd(), "public", "logo-transparent.png")
    if (fs.existsSync(p)) return fs.readFileSync(p)
  } catch {}
  return null
}

async function loadImageBuffer(url: string, timeoutMs = 12000): Promise<Buffer | null> {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), timeoutMs)
    const res = await fetch(url, { signal: ctrl.signal })
    clearTimeout(t)
    if (!res.ok) return null
    return Buffer.from(await res.arrayBuffer())
  } catch {
    return null
  }
}

function linearGradient(
  doc: PDFKit.PDFDocument,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  stops: Array<[number, string]>
) {
  const g = doc.linearGradient(x1, y1, x2, y2)
  for (const [pos, color] of stops) g.stop(pos, color)
  return g
}

function drawFront(
  doc: PDFKit.PDFDocument,
  reg: IdCardRegistration,
  qrBuffers: { verify: Buffer | null },
  logo: Buffer | null
) {
  // ─── Lanyard bar ───
  const barGrad = linearGradient(doc, 0, 0, W, mm(16), [
    [0, GOLD],
    [0.5, GOLD_LIGHT],
    [1, GOLD],
  ])
  doc.rect(0, 0, W, mm(16)).fill(barGrad)
  // Two lanyard slots — matched to preview's `padding: 0 20mm; space-around`
  doc.save()
  doc.lineWidth(mm(0.4))
  doc.strokeColor("#cbd5e1")
  doc.roundedRect(mm(42), mm(6), mm(10), mm(4), mm(2)).fillAndStroke(WHITE, "#cbd5e1")
  doc.roundedRect(mm(96), mm(6), mm(10), mm(4), mm(2)).fillAndStroke(WHITE, "#cbd5e1")
  doc.restore()

  // ─── Front content ───
  const leftW = W * 0.38 // 56.24mm
  const rightX = leftW

  // Left column spans full height below lanyard (16mm to H)
  const leftCenter = mm(16) + (H - mm(16)) / 2
  // Right column spans from lanyard to footer (16mm to H-12mm)
  const rightCenter = mm(16) + (H - mm(16) - mm(12)) / 2

  // Left: branding background
  doc.rect(0, mm(16), leftW, H - mm(16)).fill(WHITE)

  // dashed vertical border between left & right
  doc.save()
  doc.dash(mm(3), { space: mm(2) })
  doc.lineWidth(mm(0.4))
  doc.strokeColor(GOLD)
  doc.moveTo(rightX, mm(16)).lineTo(rightX, H).stroke()
  doc.restore()

  // ─── Left: branding block (vertically centered) ───
  const brandX = mm(6)
  const brandW = leftW - mm(12)
  doc.font("Inter-Bold").fontSize(8)
  const titleH = doc.heightOfString("1ST POULTRY\nCONCLAVE", { width: brandW, lineGap: 2.4 })
  doc.font("Inter-Bold").fontSize(7)
  const dateH = doc.heightOfString("23 AUG 2026", { width: brandW })
  doc.font("Inter-Bold").fontSize(6)
  const venueH = doc.heightOfString("Baba Gambhirnath Auditorium, Gorakhpur", {
    width: brandW,
    lineGap: 2.4,
  })

  const logoW = mm(35)
  const logoX = (leftW - logoW) / 2
  const leftBlockH = logoW + mm(3) + titleH + mm(2) + dateH + mm(2) + venueH
  const logoY = leftCenter - leftBlockH / 2
  if (logo) {
    doc.image(logo, logoX, logoY, { width: logoW, height: logoW, fit: [mm(35), mm(35)] })
  }
  let y = logoY + logoW + mm(3)

  // title
  doc.font("Inter-Bold").fontSize(8).fillColor(DARK_TEXT)
  doc.text("1ST POULTRY\nCONCLAVE", brandX, y, { width: brandW, align: "center", lineGap: 2.4 })
  y += titleH + mm(2)

  // date pill (sized to the text, rounded, centered — like the preview)
  doc.font("Inter-Bold").fontSize(7).fillColor(NAVY_800)
  const dateW = doc.widthOfString("23 AUG 2026")
  const pillW = dateW + mm(6)
  const pillX = brandX + (brandW - pillW) / 2
  doc.save()
  doc.opacity(0.2)
  doc.roundedRect(pillX, y - mm(1.2), pillW, mm(5), mm(1.5)).fill(GOLD)
  doc.restore()
  doc.text("23 AUG 2026", brandX, y, { width: brandW, align: "center" })
  y += dateH + mm(2)

  // venue
  doc.font("Inter-Bold").fontSize(6).fillColor(NAVY_400)
  doc.text("Baba Gambhirnath Auditorium, Gorakhpur", brandX, y, { width: brandW, align: "center", lineGap: 2.4 })

  // ─── Right: attendee info (vertically centered) ───
  const padX = mm(8)
  const textW = W - rightX - padX * 2 - mm(30) - mm(4) // right column minus QR width + gap

  // measure each text stack with its own font so the block can be centered
  doc.font("Inter-Bold").fontSize(18)
  const nameH = doc.heightOfString(reg.name.toUpperCase(), { width: textW, lineGap: 1.8 })
  doc.font("Inter-Bold").fontSize(10)
  const roleH = doc.heightOfString(reg.occupation.toUpperCase(), { width: textW, lineGap: 1 })
  doc.font("Inter-Bold").fontSize(8)
  const cityH = doc.heightOfString("GORAKHPUR · INDIA", { width: textW, lineGap: 1 })

  const textStackH = nameH + mm(6) + roleH + mm(2) + cityH
  const textTop = rightCenter - textStackH / 2

  // QR stack (QR 30mm + 2mm gap + 6mm reg-id bar), centered too
  const qrSize = mm(30)
  const qrX = W - padX - qrSize
  const qrStackH = qrSize + mm(2) + mm(6)
  const qrY = rightCenter - qrStackH / 2

  // attendee name (may wrap)
  doc.font("Inter-Bold").fontSize(18).fillColor(DARK_TEXT)
  doc.text(reg.name.toUpperCase(), rightX + padX, textTop, {
    width: textW,
    lineGap: 1.8,
  })

  // QR on right side
  if (qrBuffers.verify) {
    doc.image(qrBuffers.verify, qrX, qrY, { width: qrSize, height: qrSize })
  } else {
    doc.rect(qrX, qrY, qrSize, qrSize).fill(SLATE_100)
  }
  // reg-id label under QR
  doc.font("Courier-Bold").fontSize(7).fillColor(NAVY_800)
  doc.save()
  doc.rect(qrX - mm(2), qrY + qrSize + mm(2), qrSize + mm(4), mm(6)).fill(SLATE_100)
  doc.restore()
  doc.text(reg.regId, qrX - mm(2), qrY + qrSize + mm(2), { width: qrSize + mm(4), align: "center" })

  // role + city under name
  const roleY = textTop + nameH + mm(6)
  doc.font("Inter-Bold").fontSize(10).fillColor(GOLD)
  doc.text(reg.occupation.toUpperCase(), rightX + padX, roleY, { width: textW, lineGap: 1 })
  doc.font("Inter-Bold").fontSize(8).fillColor(NAVY_400)
  doc.text("GORAKHPUR · INDIA", rightX + padX, roleY + roleH + mm(2), { width: textW, lineGap: 1 })

  // ─── Category footer ───
  const footerY = H - mm(12)
  doc.rect(rightX, footerY, W - rightX, mm(12)).fill(NAVY_900)
  doc.save()
  doc.lineWidth(mm(0.4))
  doc.strokeColor(GOLD)
  doc.moveTo(rightX, footerY).lineTo(W, footerY).stroke()
  doc.restore()
  doc.font("Inter-Bold").fontSize(11).fillColor(GOLD_LIGHT)
  doc.text(reg.occupation.toUpperCase(), rightX, footerY + mm(3.5), {
    width: W - rightX,
    align: "center",
    characterSpacing: 3, // preview uses letter-spacing 4px
  })
}

function drawBack(
  doc: PDFKit.PDFDocument,
  reg: IdCardRegistration,
  qrBuffers: { event: Buffer | null; feedback: Buffer | null }
) {
  // 1. White background
  doc.rect(0, 0, W, H).fill(WHITE)

  // 2. Lanyard bar (top 16mm)
  const barGrad = linearGradient(doc, 0, 0, W, mm(16), [
    [0, GOLD],
    [0.5, GOLD_LIGHT],
    [1, GOLD],
  ])
  doc.rect(0, 0, W, mm(16)).fill(barGrad)
  doc.save()
  doc.lineWidth(mm(0.4))
  doc.strokeColor("#cbd5e1")
  doc.roundedRect(mm(42), mm(6), mm(10), mm(4), mm(2)).fillAndStroke(WHITE, "#cbd5e1")
  doc.roundedRect(mm(96), mm(6), mm(10), mm(4), mm(2)).fillAndStroke(WHITE, "#cbd5e1")
  doc.restore()

  // 3. Bottom footer (bottom 12mm)
  const footerY = H - mm(12)
  doc.rect(0, footerY, W, mm(12)).fill(NAVY_900)
  doc.save()
  doc.lineWidth(mm(0.4))
  doc.strokeColor(GOLD)
  doc.moveTo(0, footerY).lineTo(W, footerY).stroke()
  doc.restore()
  doc.font("Inter-Bold").fontSize(11).fillColor(GOLD_LIGHT)
  doc.text("SEE YOU NEXT EDITION: 2027", 0, footerY + mm(3.5), {
    width: W,
    align: "center",
    characterSpacing: 3,
  })

  // 4. Middle Content (between 16mm and H-12mm)
  const midTop = mm(16)
  const colW = mm(34)
  const rulesX = colW
  const rulesEnd = W - colW

  // Left QR
  const qrL = mm(26)
  const qrY = midTop + mm(12)
  if (qrBuffers.event) {
    doc.image(qrBuffers.event, mm(4) + mm(0.5), qrY + mm(0.5), { width: qrL - mm(1), height: qrL - mm(1) })
  } else {
    doc.rect(mm(4) + mm(0.5), qrY + mm(0.5), qrL - mm(1), qrL - mm(1)).fill(SLATE_100)
  }
  doc.save()
  doc.lineWidth(mm(0.5))
  doc.strokeColor(GOLD)
  doc.roundedRect(mm(4), qrY, qrL, qrL, mm(1.5)).stroke()
  doc.restore()
  doc.font("Inter-Bold").fontSize(8).fillColor(DARK_TEXT)
  doc.text("EVENT\nINFO", mm(4), qrY + qrL + mm(4), { width: qrL, align: "center", lineGap: 2.4 })

  // Right QR
  const rightX = W - colW
  if (qrBuffers.feedback) {
    doc.image(qrBuffers.feedback, rightX + mm(4) + mm(0.5), qrY + mm(0.5), { width: qrL - mm(1), height: qrL - mm(1) })
  } else {
    doc.rect(rightX + mm(4) + mm(0.5), qrY + mm(0.5), qrL - mm(1), qrL - mm(1)).fill(SLATE_100)
  }
  doc.save()
  doc.lineWidth(mm(0.5))
  doc.strokeColor(GOLD)
  doc.roundedRect(rightX + mm(4), qrY, qrL, qrL, mm(1.5)).stroke()
  doc.restore()
  doc.text("FEEDBACK\nFORM", rightX + mm(4), qrY + qrL + mm(4), { width: qrL, align: "center", lineGap: 2.4 })

  // Dividers
  doc.save()
  doc.dash(mm(3), { space: mm(2) })
  doc.lineWidth(mm(0.4))
  doc.strokeColor(GOLD)
  doc.moveTo(colW, midTop).lineTo(colW, footerY).stroke()
  doc.moveTo(W - colW, midTop).lineTo(W - colW, footerY).stroke()
  doc.restore()

  // Rules area
  const pad = mm(6)
  const rulesW = rulesEnd - rulesX - pad * 2
  
  let currentY = midTop + mm(17)
  doc.font("Inter-Bold").fontSize(11).fillColor(DARK_TEXT)
  doc.text("GUIDELINES", rulesX + pad, currentY, { width: rulesW, align: "center", characterSpacing: 1 })

  const rules = [
    "Badge is mandatory for entry & non-transferable.",
    "Organizers are not liable for any loss/damage.",
    "Entry may be denied for security violations.",
    "Children below 10 years are not permitted.",
    "For assistance, contact the help desk.",
  ]
  currentY += mm(8)
  doc.font("Inter-Bold").fontSize(8).fillColor(NAVY_800)
  for (const rule of rules) {
    doc.circle(rulesX + pad + mm(1.0), currentY + mm(2.5), mm(1.0)).fill(GOLD)
    doc.text(rule, rulesX + pad + mm(4), currentY, { width: rulesW - mm(4), lineGap: 3.2 })
    currentY += doc.heightOfString(rule, { width: rulesW - mm(4), lineGap: 3.2 }) + mm(2.5)
  }
}

/**
 * Generate an A6 landscape (148mm × 105mm) ID card PDF with front + back.
 * Returns the raw PDF bytes.
 */
export async function generateIdCardPdf(
  reg: IdCardRegistration,
  opts: IdCardPdfOptions
): Promise<Buffer> {
  const logo = await loadLogoBuffer(opts.logoBuffer)

  const verifyUrl = `${opts.siteUrl}/verify?id=${encodeURIComponent(reg.regId)}`
  const infoUrl = `${opts.siteUrl}/`
  const feedbackUrl = `${opts.siteUrl}/feedback`

  const [verifyQr, eventQr, feedbackQr] = await Promise.all([
    loadImageBuffer(qrUrl(verifyUrl, 300)),
    loadImageBuffer(qrUrl(infoUrl, 350)),
    loadImageBuffer(qrUrl(feedbackUrl, 350)),
  ])

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: [W, H],
      margin: 0,
      autoFirstPage: false,
    } as PDFKit.PDFDocumentOptions)

    try {
      doc.registerFont("Inter-Bold", path.join(process.cwd(), "public", "fonts", "Inter-Bold.ttf"))
      doc.registerFont("Inter-Regular", path.join(process.cwd(), "public", "fonts", "Inter-Regular.ttf"))
    } catch (e) {
      // Fallback
      doc.registerFont("Inter-Bold", "Helvetica-Bold")
      doc.registerFont("Inter-Regular", "Helvetica")
    }

    const chunks: Buffer[] = []
    doc.on("data", (c: Buffer) => chunks.push(c))
    doc.on("end", () => resolve(Buffer.concat(chunks)))
    doc.on("error", reject)

    // ── FRONT PAGE ──
    doc.addPage({ size: [W, H], margin: 0 } as PDFKit.PDFDocumentOptions)
    drawFront(doc, reg, { verify: verifyQr }, logo)

    // ── BACK PAGE ──
    doc.addPage({ size: [W, H], margin: 0 } as PDFKit.PDFDocumentOptions)
    drawBack(doc, reg, { event: eventQr, feedback: feedbackQr })

    doc.end()
  })
}