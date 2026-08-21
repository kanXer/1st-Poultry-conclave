"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Loader } from "lucide-react"

interface Registration {
  _id: string
  id: string
  regId: string
  name: string
  occupation: string
  phone: string
  email: string
  timestamp: string
}

function qr(data: string, size = 120) {
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=${size}x${size}&margin=4&color=000000&bgcolor=ffffff`
}

function PrintCard({ reg }: { reg: Registration }) {
  // Use window origin for absolute QR code URLs, fallback to env variable if SSR
  const origin = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || "https://poultryconclave.in")
  
  const verifyUrl = `${origin}/verify?id=${reg.regId}`
  const registrationListUrl = `${origin}/register`
  const feedbackUrl = `${origin}/feedback`

  return (
    <div id="id-card-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
          background: #10294a;
          font-family: 'Inter', Arial, sans-serif;
          /* Force browsers to print background colors and images */
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }

        /* A6 landscape (148mm × 105mm) is the default paper size for printing.
           Must be at the top level of the stylesheet — Chrome/Edge ignore @page
           rules nested inside @media print. */
        @page {
          size: 148mm 105mm;
          margin: 0;
        }

        @media print {
          html, body {
            background: #10294a !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 148mm !important;
            height: 105mm !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .no-print { display: none !important; }
          .wrapper { padding: 0 !important; gap: 0 !important; }
          .card { box-shadow: none !important; border-radius: 0 !important; border: none !important; position: relative; }
          /* Inset black frame so all four sides print inside the printer's
             non-printable margin instead of being clipped at the page edge. */
          .card::after {
            content: "" !important;
            position: absolute !important;
            inset: 0 !important;
            border: 1.5px solid #000000 !important;
            pointer-events: none !important;
            z-index: 5 !important;
          }
          .back-card { transform: rotate(180deg); transform-origin: center center; }
          .page-break { page-break-after: always; }
          /* Rotate the back side 180° so that after a duplex (short-edge)
             print + flip, the ID/content reads in the same direction as front. */
          .back-card { transform: rotate(180deg); transform-origin: center center; }
        }

        /* Keep A6 landscape on screen too, and scale down on small phones */
        .wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          padding: 32px 16px;
        }

        @media screen and (max-width: 700px) {
          .wrapper { align-items: center; justify-content: center; gap: 16px; padding: 12px 8px; }
          .wrapper > div { width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
          .card { zoom: min(1, calc((100vw - 16px) / 560px)); }
          .print-btn-row { flex-direction: column; width: 100%; padding: 0 12px; align-items: center; }
          .print-btn { width: 100%; padding: 14px 16px; font-size: 15px; }
          .print-tip { width: 100%; margin: 8px auto 0; text-align: center; }
          .no-print { text-align: center !important; }
          .print-btn-row a, .print-btn-row button { width: 100%; }
        }

        .card {
          width: 148mm;
          height: 105mm;
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          background: white;
          border: 1px solid #e2e8f0;
        }

        /* ─── FRONT ─── */
        
        .lanyard-bar {
          background: linear-gradient(135deg, #c98a2f, #e5c377, #c98a2f);
          height: 16mm;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 20mm;
        }
        .lanyard-hole {
          width: 10mm; height: 4mm;
          border-radius: 4px;
          background: white;
          border: 1px solid rgba(0,0,0,0.2);
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);
        }

        .front-content {
          display: flex;
          flex: 1;
        }

        /* Left Side: Branding */
        .front-left {
          width: 38%;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6mm;
          border-right: 2px dashed #c98a2f;
        }
        .front-left img {
          width: 35mm;
          height: 35mm;
          object-fit: contain;
          margin-bottom: 3mm;
          /* Uses transparent PNG natively */
        }
        .brand-text {
          text-align: center;
        }
        .brand-text .title {
          font-size: 8pt;
          font-weight: 900;
          color: #0a1c33;
          text-transform: uppercase;
          line-height: 1.3;
          margin-bottom: 2mm;
        }
        .brand-text .date {
          font-size: 7pt;
          font-weight: 800;
          color: #10294a;
          background: rgba(201,138,47,0.2);
          padding: 1.5mm 3mm;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 2mm;
        }
        .brand-text .venue {
          font-size: 6pt;
          color: #4f84ac;
          line-height: 1.4;
          font-weight: 700;
        }

        /* Right Side: Attendee Info */
        .front-right {
          width: 62%;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .attendee-info {
          flex: 1;
          padding: 6mm 8mm;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4mm;
        }
        .text-info {
          flex: 1;
        }
        .attendee-name {
          font-size: 18pt;
          font-weight: 900;
          color: #0a1c33;
          text-transform: uppercase;
          line-height: 1.1;
          margin-bottom: 2mm;
        }
        .attendee-role {
          font-size: 10pt;
          font-weight: 800;
          color: #c98a2f;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 1.5mm;
        }
        .attendee-city {
          font-size: 8pt;
          font-weight: 700;
          color: #4f84ac;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .qr-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2mm;
        }
        .qr-box img {
          width: 30mm;
          height: 30mm;
          border-radius: 3px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .reg-id {
          font-size: 7pt;
          font-weight: 800;
          color: #10294a;
          font-family: monospace;
          background: #f1f5f9;
          padding: 1mm 2mm;
          border-radius: 3px;
        }

        /* Footer Category */
        .category-footer {
          background: #0a1c33;
          height: 12mm;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: 2px solid #c98a2f;
        }
        .category-footer span {
          font-size: 11pt;
          font-weight: 900;
          color: #e5c377;
          text-transform: uppercase;
          letter-spacing: 4px;
        }

        /* ─── BACK ─── */
        .back-card {
          width: 148mm;
          height: 105mm;
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          background: white;
          border: 1px solid #e2e8f0;
        }
        .back-content {
          display: flex;
          flex: 1;
          flex-direction: row;
          align-items: stretch;
        }
        .bk-qr-col {
          width: 34mm;
          min-width: 34mm;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3mm;
          padding: 6mm 4mm;
        }
        .bk-qr-col img {
          width: 26mm;
          height: 26mm;
          border-radius: 4px;
          border: 1.5px solid #c98a2f;
          display: block;
        }
        .bk-qr-label {
          font-size: 8pt;
          font-weight: 900;
          color: #0a1c33;
          text-transform: uppercase;
          text-align: center;
          line-height: 1.3;
        }
        .bk-divider {
          width: 0;
          border-left: 2px dashed #c98a2f;
          align-self: stretch;
        }
        .bk-rules {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 4mm 6mm;
          justify-content: center;
        }
        .rules-title {
          font-size: 11pt;
          font-weight: 900;
          color: #0a1c33;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 3mm;
          text-align: center;
        }
        .rule-item {
          display: flex;
          align-items: flex-start;
          gap: 2mm;
          margin-bottom: 2.5mm;
        }
        .rule-dot {
          width: 2mm; height: 2mm;
          background: #c98a2f;
          border-radius: 50%;
          margin-top: 1.5mm;
          flex-shrink: 0;
        }
        .rule-text {
          font-size: 8pt;
          color: #10294a;
          font-weight: 700;
          line-height: 1.4;
        }

        /* UI Buttons */
        .print-btn-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          align-items: center;
          margin-top: 8px;
        }
        .print-btn {
          padding: 10px 28px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .btn-primary { background: linear-gradient(135deg, #c98a2f, #d9a94f); color: #0a1c33; }
        .btn-primary:hover { background: linear-gradient(135deg, #b06f26, #c98a2f); }
        .btn-secondary { background: rgba(255,255,255,0.08); color: #e5c377; border: 1.5px solid rgba(201,138,47,0.4); }
        .btn-secondary:hover { background: rgba(255,255,255,0.12); }

        .print-tip {
          max-width: 520px;
          width: 100%;
          margin: 12px auto 0;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(201,138,47,0.35);
          background: rgba(201,138,47,0.12);
          color: #e5c377;
          font-size: 12.5px;
          line-height: 1.5;
          text-align: center;
        }
      `}</style>

      {/* Print controls — hidden during actual print */}
      <div className="no-print">
        <div className="print-tip">
          <strong>A6 Landscape printing:</strong> in the print dialog choose paper size{" "}
          <strong>A6</strong> (or <strong>148 × 105 mm Custom</strong>), margins <strong>None</strong>,
          scale <strong>100%</strong>, and for double-sided use <strong>Flip on short edge</strong>{" "}
          (so the back reads the same way as the front). If your printer still won&apos;t use A6, use{" "}
          <strong>Download A6 PDF</strong> and print that file at 100% size.
        </div>
        <div className="print-btn-row">
          <button className="print-btn btn-secondary" onClick={() => window.close()}>✕ Close</button>
          <a className="print-btn btn-secondary" href={`/api/idcard/pdf?id=${encodeURIComponent(reg.regId)}`}>
            ⬇️ Download A6 PDF
          </a>
          <button className="print-btn btn-primary" onClick={() => window.print()}>🖨️ Print ID Card</button>
        </div>
      </div>

      <div className="wrapper">
        {/* ───── FRONT SIDE ───── */}
        <div>
          <p className="no-print" style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: 2 }}>
            — Front Side (Landscape) —
          </p>
          <div className="card front page-break">
            {/* Lanyard bar */}
            <div className="lanyard-bar">
              <div className="lanyard-hole" />
              <div className="lanyard-hole" />
            </div>

            <div className="front-content">
              {/* Left Branding */}
              <div className="front-left">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-transparent.png" alt="Logo" />
                <div className="brand-text">
                  <div className="title">1st Poultry<br />Conclave</div>
                  <div className="date">23 AUG 2026</div>
                  <div className="venue">Baba Gambhirnath<br />Auditorium, Gorakhpur</div>
                </div>
              </div>

              {/* Right Details */}
              <div className="front-right">
                <div className="attendee-info">
                  <div className="text-info">
                    <div className="attendee-name">{reg.name}</div>
                    <div className="attendee-role">{reg.occupation}</div>
                    <div className="attendee-city">GORAKHPUR · INDIA</div>
                  </div>
                  <div className="qr-box">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qr(verifyUrl, 120)} alt="QR Code" />
                    <div className="reg-id">{reg.regId}</div>
                  </div>
                </div>
                
                {/* Category footer inside right side to span bottom */}
                <div className="category-footer">
                  <span>{reg.occupation.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ───── BACK SIDE ───── */}
        <div>
          <p className="no-print" style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: 2 }}>
            — Back Side (Landscape) —
          </p>
          <div className="card back-card">
            {/* Lanyard bar */}
            <div className="lanyard-bar">
              <div className="lanyard-hole" />
              <div className="lanyard-hole" />
            </div>

            <div className="back-content">
              {/* Left QR — Event Info */}
              <div className="bk-qr-col">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr(registrationListUrl, 130)} alt="Event Info QR" />
                <div className="bk-qr-label">Event<br />Info</div>
              </div>

              <div className="bk-divider" />

              {/* Center Rules */}
              <div className="bk-rules">
                <div className="rules-title">GUIDELINES</div>
                {[
                  "Badge is mandatory for entry & non-transferable.",
                  "Organizers are not liable for any loss/damage.",
                  "Entry may be denied for security violations.",
                  "Children below 10 years are not permitted.",
                  "For assistance, contact the help desk."
                ].map((rule, i) => (
                  <div key={i} className="rule-item">
                    <div className="rule-dot" />
                    <div className="rule-text">{rule}</div>
                  </div>
                ))}
              </div>

              <div className="bk-divider" />

              {/* Right QR — Feedback */}
              <div className="bk-qr-col">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr(feedbackUrl, 130)} alt="Feedback QR" />
                <div className="bk-qr-label">Feedback<br />Form</div>
              </div>
            </div>

            {/* Category footer style full width */}
            <div className="category-footer" style={{ width: '100%' }}>
              <span>SEE YOU NEXT EDITION: 2027</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PrintPageContent() {
  const searchParams = useSearchParams()
  const regId = searchParams.get("id")
  const [reg, setReg] = useState<Registration | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!regId) { setError("No registration ID provided."); setLoading(false); return }
    fetch(`/api/registration?id=${encodeURIComponent(regId)}`)
      .then(async r => {
        const d = await r.json()
        if (!r.ok) throw new Error(d.error || "Failed to load registration.")
        if (!d.registration) throw new Error("No data")
        setReg(d.registration)
        // Nice default filename when saving as PDF from the browser dialog
        if (d.registration.regId && d.registration.name) {
          document.title = `${d.registration.regId} ${d.registration.name}`
        }
      })
      .catch(e => setError(e.message || "Failed to load registration."))
      .finally(() => setLoading(false))
  }, [regId])

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial" }}>
      <Loader style={{ width: 32, height: 32, animation: "spin 1s linear infinite" }} />
    </div>
  )

  if (error || !reg) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial", color: "#ef4444" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 18, fontWeight: 700 }}>Error</p>
        <p style={{ marginTop: 8, fontSize: 14, color: "#64748b" }}>{error}</p>
        <button onClick={() => window.close()} style={{ marginTop: 16, padding: "8px 20px", borderRadius: 8, background: "#f1f5f9", border: "1px solid #cbd5e1", cursor: "pointer" }}>
          Close
        </button>
      </div>
    </div>
  )

  return <PrintCard reg={reg} />
}

export default function PrintIdCardPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader style={{ width: 32, height: 32 }} />
      </div>
    }>
      <PrintPageContent />
    </Suspense>
  )
}
