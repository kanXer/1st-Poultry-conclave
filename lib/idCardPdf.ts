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

// A6 landscape = 148mm × 105mm
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

/**
 * Helper: Text ko multi-line or single-line bounded box me fit karne ke liye dynamic font size calculate karta hai.
 */
function getFittedFontSize(
  doc: PDFKit.PDFDocument,
  text: string,
  fontName: string,
  startSize: number,
  minSize: number,
  maxWidth: number,
  maxHeight: number,
  options?: { lineGap?: number; characterSpacing?: number }
): number {
  let size = startSize
  doc.font(fontName)
  while (size > minSize) {
    doc.fontSize(size)
    const h = doc.heightOfString(text, {
      width: maxWidth,
      lineGap: options?.lineGap ?? 0,
      characterSpacing: options?.characterSpacing ?? 0,
    })
    if (h <= maxHeight) {
      return size
    }
    size -= 0.5
  }
  return minSize
}

/**
 * Helper: Single-line Footer Text ke liye font size aur letter spacing fit karta hai.
 */
function getFooterFontConfig(
  doc: PDFKit.PDFDocument,
  text: string,
  maxWidth: number
): { fontSize: number; characterSpacing: number } {
  doc.font("Inter-Bold")
  let size = 11
  let spacing = 3

  while (size >= 6) {
    doc.fontSize(size)
    const w = doc.widthOfString(text, { characterSpacing: spacing })
    if (w <= maxWidth) {
      return { fontSize: size, characterSpacing: spacing }
    }
    if (spacing > 0.5) {
      spacing -= 0.5
    } else {
      size -= 0.5
    }
  }
  return { fontSize: 6, characterSpacing: 0 }
}

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
  
  doc.save()
  doc.lineWidth(mm(0.4))
  doc.strokeColor("#cbd5e1")
  doc.roundedRect(mm(42), mm(6), mm(10), mm(4), mm(2)).fillAndStroke(WHITE, "#cbd5e1")
  doc.roundedRect(mm(96), mm(6), mm(10), mm(4), mm(2)).fillAndStroke(WHITE, "#cbd5e1")
  doc.restore()

  // ─── Front content ───
  const leftW = W * 0.38
  const rightX = leftW

  const leftCenter = mm(16) + (H - mm(16)) / 2
  const rightCenter = mm(16) + (H - mm(16) - mm(12)) / 2

  doc.rect(0, mm(16), leftW, H - mm(16)).fill(WHITE)

  doc.save()
  doc.dash(mm(3), { space: mm(2) })
  doc.lineWidth(mm(0.4))
  doc.strokeColor(GOLD)
  doc.moveTo(rightX, mm(16)).lineTo(rightX, H).stroke()
  doc.restore()

  // ─── Left: branding block ───
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
  let logoY = leftCenter - leftBlockH / 2
  if (logoY < mm(17)) logoY = mm(17)

  if (logo) {
    doc.image(logo, logoX, logoY, { width: logoW, height: logoW, fit: [mm(35), mm(35)] })
  }
  let y = logoY + logoW + mm(3)

  doc.font("Inter-Bold").fontSize(8).fillColor(DARK_TEXT)
  doc.text("1ST POULTRY\nCONCLAVE", brandX, y, { width: brandW, align: "center", lineGap: 2.4, height: titleH + mm(1), ellipsis: true })
  y += titleH + mm(2)

  doc.font("Inter-Bold").fontSize(7).fillColor(NAVY_800)
  const dateW = doc.widthOfString("23 AUG 2026")
  const pillW = dateW + mm(6)
  const pillX = brandX + (brandW - pillW) / 2
  doc.save()
  doc.opacity(0.2)
  doc.roundedRect(pillX, y - mm(1.2), pillW, mm(5), mm(1.5)).fill(GOLD)
  doc.restore()
  doc.text("23 AUG 2026", brandX, y, { width: brandW, align: "center", height: dateH + mm(1), ellipsis: true })
  y += dateH + mm(2)

  doc.font("Inter-Bold").fontSize(6).fillColor(NAVY_400)
  doc.text("Baba Gambhirnath Auditorium, Gorakhpur", brandX, y, { width: brandW, align: "center", lineGap: 2.4, height: venueH + mm(1), ellipsis: true })

  // ─── Right: attendee info (Dynamic Scaling + Bound Clamping) ───
  const padX = mm(8)
  const textW = W - rightX - padX * 2 - mm(30) - mm(4)

  const nameText = reg.name.toUpperCase()
  const roleText = reg.occupation.toUpperCase()
  const cityText = "GORAKHPUR · INDIA"

  // Dynamic font sizes calculate kar rahe hain taaki height exceed na ho
  const nameFontSize = getFittedFontSize(doc, nameText, "Inter-Bold", 18, 9, textW, mm(18), { lineGap: 1.5 })
  const roleFontSize = getFittedFontSize(doc, roleText, "Inter-Bold", 10, 7, textW, mm(10), { lineGap: 1 })
  const cityFontSize = 8

  doc.font("Inter-Bold").fontSize(nameFontSize)
  const nameH = doc.heightOfString(nameText, { width: textW, lineGap: 1.5 })

  doc.font("Inter-Bold").fontSize(roleFontSize)
  const roleH = doc.heightOfString(roleText, { width: textW, lineGap: 1 })

  doc.font("Inter-Bold").fontSize(cityFontSize)
  const cityH = doc.heightOfString(cityText, { width: textW, lineGap: 1 })

  const gap1 = mm(4)
  const gap2 = mm(2)
  const textStackH = nameH + gap1 + roleH + gap2 + cityH

  // Boundaries clamping
  const topLimit = mm(18)
  const bottomLimit = H - mm(14)
  let textTop = rightCenter - textStackH / 2

  if (textTop < topLimit) textTop = topLimit
  if (textTop + textStackH > bottomLimit) {
    textTop = Math.max(topLimit, bottomLimit - textStackH)
  }

  // QR Stack
  const qrSize = mm(30)
  const qrX = W - padX - qrSize
  const qrStackH = qrSize + mm(2) + mm(6)
  let qrY = rightCenter - qrStackH / 2
  if (qrY < topLimit) qrY = topLimit

  // Render Name
  doc.font("Inter-Bold").fontSize(nameFontSize).fillColor(DARK_TEXT)
  doc.text(nameText, rightX + padX, textTop, {
    width: textW,
    lineGap: 1.5,
    height: nameH + mm(1),
    ellipsis: true,
  })

  // Render QR
  if (qrBuffers.verify) {
    doc.image(qrBuffers.verify, qrX, qrY, { width: qrSize, height: qrSize })
  } else {
    doc.rect(qrX, qrY, qrSize, qrSize).fill(SLATE_100)
  }

  // Render Reg ID under QR
  doc.font("Courier-Bold").fontSize(7).fillColor(NAVY_800)
  doc.save()
  doc.rect(qrX - mm(2), qrY + qrSize + mm(2), qrSize + mm(4), mm(6)).fill(SLATE_100)
  doc.restore()
  doc.text(reg.regId, qrX - mm(2), qrY + qrSize + mm(3), {
    width: qrSize + mm(4),
    align: "center",
    height: mm(5),
    ellipsis: true,
  })

  // Render Role + City
  const roleY = textTop + nameH + gap1
  doc.font("Inter-Bold").fontSize(roleFontSize).fillColor(GOLD)
  doc.text(roleText, rightX + padX, roleY, {
    width: textW,
    lineGap: 1,
    height: roleH + mm(1),
    ellipsis: true,
  })

  doc.font("Inter-Bold").fontSize(cityFontSize).fillColor(NAVY_400)
  doc.text(cityText, rightX + padX, roleY + roleH + gap2, {
    width: textW,
    lineGap: 1,
    height: cityH + mm(1),
    ellipsis: true,
  })

  // ─── Category Footer (Single-line Scaling) ───
  const footerY = H - mm(12)
  doc.rect(rightX, footerY, W - rightX, mm(12)).fill(NAVY_900)
  doc.save()
  doc.lineWidth(mm(0.4))
  doc.strokeColor(GOLD)
  doc.moveTo(rightX, footerY).lineTo(W, footerY).stroke()
  doc.restore()

  const footerW = W - rightX - mm(6)
  const { fontSize: footerFontSize, characterSpacing: footerSpacing } = getFooterFontConfig(
    doc,
    roleText,
    footerW
  )

  doc.font("Inter-Bold").fontSize(footerFontSize).fillColor(GOLD_LIGHT)
  doc.text(roleText, rightX + mm(3), footerY + mm(3.5), {
    width: footerW,
    align: "center",
    characterSpacing: footerSpacing,
    height: mm(7),
    ellipsis: true,
  })
}

function drawBack(
  doc: PDFKit.PDFDocument,
  reg: IdCardRegistration,
  qrBuffers: { event: Buffer | null; feedback: Buffer | null }
) {
  doc.rect(0, 0, W, H).fill(WHITE)

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
    height: mm(7),
    ellipsis: true,
  })

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
  doc.text("EVENT\nINFO", mm(4), qrY + qrL + mm(4), { width: qrL, align: "center", lineGap: 2.4, height: mm(10), ellipsis: true })

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
  doc.text("FEEDBACK\nFORM", rightX + mm(4), qrY + qrL + mm(4), { width: qrL, align: "center", lineGap: 2.4, height: mm(10), ellipsis: true })

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
  
  let currentY = midTop + mm(15)
  doc.font("Inter-Bold").fontSize(10).fillColor(DARK_TEXT)
  doc.text("GUIDELINES", rulesX + pad, currentY, { width: rulesW, align: "center", characterSpacing: 1, height: mm(6), ellipsis: true })

  const rules = [
    "Badge is mandatory for entry & non-transferable.",
    "Organizers are not liable for any loss/damage.",
    "Entry may be denied for security violations.",
    "Children below 10 years are not permitted.",
    "For assistance, contact the help desk.",
  ]
  currentY += mm(6)
  const maxRulesY = H - mm(14)

  doc.font("Inter-Bold").fontSize(7.5).fillColor(NAVY_800)
  for (const rule of rules) {
    const ruleW = rulesW - mm(4)
    const rHeight = doc.heightOfString(rule, { width: ruleW, lineGap: 2 })
    
    // Safety check so rules don't breach footer
    if (currentY + rHeight > maxRulesY) break

    doc.circle(rulesX + pad + mm(1.0), currentY + mm(2.2), mm(0.8)).fill(GOLD)
    doc.text(rule, rulesX + pad + mm(4), currentY, {
      width: ruleW,
      lineGap: 2,
      height: rHeight + mm(1),
      ellipsis: true,
    })
    currentY += rHeight + mm(2)
  }
}

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
