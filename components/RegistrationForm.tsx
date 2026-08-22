'use client'

import { useEffect, useRef, useState, type FormEvent } from "react"
import { User, Briefcase, Phone, Mail, Loader2, CheckCircle2, ShieldCheck, RefreshCw, AlertCircle, CalendarCheck, MapPin, Download } from "lucide-react"
import ScrollReveal from "./ScrollReveal"

interface CaptchaData {
  id: string
  question: string
}

export default function RegistrationForm() {
  const [form, setForm] = useState({
    name: "",
    occupation: "",
    phone: "",
    email: "",
  })
  const [captcha, setCaptcha] = useState<CaptchaData | null>(null)
  const [captchaAnswer, setCaptchaAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [regId, setRegId] = useState("")
  const [submittedName, setSubmittedName] = useState("")
  const [regStatus, setRegStatus] = useState<"loading" | "open" | "closed">("loading")
  const successRef = useRef<HTMLElement>(null)

  useEffect(() => {
    fetch("/api/settings/registration")
      .then((r) => r.json())
      .then((d) => setRegStatus(d.open === false ? "closed" : "open"))
      .catch(() => setRegStatus("open"))
  }, [])

  useEffect(() => {
    if (submitted) {
      const t = setTimeout(() => {
        successRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
      return () => clearTimeout(t)
    }
  }, [submitted])

  async function loadCaptcha() {
    try {
      const res = await fetch("/api/captcha")
      const data = await res.json()
      if (data.id) setCaptcha({ id: data.id, question: data.question })
    } catch {
      setCaptcha(null)
    }
  }

  useEffect(() => { loadCaptcha() }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, captchaId: captcha?.id, captchaAnswer }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.")
        setCaptchaAnswer("")
        loadCaptcha()
        return
      }

      setSubmitted(true)
      setRegId(data.regId || "")
      setSubmittedName(form.name)
      setForm({ name: "", occupation: "", phone: "", email: "" })
      setCaptchaAnswer("")
    } catch {
      setError("Network error. Please check your internet connection and try again.")
      loadCaptcha()
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section ref={successRef} className="py-12 md:py-20 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300 scroll-mt-24">
        <div className="max-w-lg mx-auto px-4">
          <ScrollReveal>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Registration Received!</h2>
              {submittedName && (
                <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto mb-4">
                  Thank you, <strong className="text-slate-900 dark:text-white">{submittedName}</strong>! Your
                  registration for the <strong>1st Poultry Conclave Gorakhpur (Edition 2026)</strong> has been
                  received. Our team will contact you shortly with the next steps.
                </p>
              )}
              {regId && (
                <div className="mb-6">
                  <div className="inline-flex flex-col items-center gap-1 bg-brand-50 dark:bg-navy-800 rounded-2xl px-8 py-4 border border-dashed border-brand-300 dark:border-brand-700 mb-4">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                      Your Registration ID
                    </span>
                    <span className="text-xl sm:text-2xl font-extrabold text-gradient tracking-wide select-all">{regId}</span>
                  </div>
                  <a
                    href={`/admin/id-cards/print?id=${encodeURIComponent(regId)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Your ID Card
                  </a>
                </div>
              )}
              <button
                type="button"
                onClick={() => { setSubmitted(false); setRegId(""); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-colors"
              >
                Register Another Person
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    )
  }

  if (regStatus === "loading") {
    return (
      <section className="py-12 md:py-20 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      </section>
    )
  }

  if (regStatus === "closed") {
    return (
      <section className="py-12 md:py-20 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-lg mx-auto px-4">
          <ScrollReveal>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none animate-fade-in">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-200 dark:border-rose-800">
                <AlertCircle className="w-9 h-9" />
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 mb-4">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Registration Stopped
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Registration is Currently Closed</h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto mb-6">
                Thank you for your interest in the <strong>1st Poultry Conclave Gorakhpur (Edition 2026)</strong>.
                Registration has been stopped for now. Please stay connected — we will announce if it reopens.
              </p>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-900/20 rounded-xl px-3.5 py-2.5 border border-brand-200/50 dark:border-brand-800/30">
                  <CalendarCheck className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Sunday, 23 August 2026</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Baba Gambhirnath Auditorium, Taramandal, Gorakhpur</p>
                  </div>
                </div>
              </div>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Back to Home
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-20 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left info */}
          <div className="lg:col-span-5">
            <ScrollReveal>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-accent-50 text-accent-700 dark:bg-accent-950/60 dark:text-accent-300 border border-accent-200/60 dark:border-accent-800/60 mb-3 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Attendee &amp; Exhibitor Registration
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                Register for the Poultry <span className="text-gradient">Conclave</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg mb-6">
                Join the 1st Poultry Conclave Gorakhpur (Edition 2026) — Innovate, Collaborate, Grow.
                Register as an attendee, farmer, enterprise owner, feed manufacturer, veterinarian,
                investor, or delegate.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-start gap-2 bg-brand-50 dark:bg-brand-900/20 rounded-xl px-3.5 py-2.5 border border-brand-200/50 dark:border-brand-800/30">
                  <CalendarCheck className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Sunday, 23 August 2026</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Mark your calendar</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-accent-50 dark:bg-accent-900/20 rounded-xl px-3.5 py-2.5 border border-accent-200/50 dark:border-accent-800/30">
                  <MapPin className="w-5 h-5 text-accent-600 dark:text-accent-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Baba Gambhirnath Auditorium</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Taramandal, Gorakhpur</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Spam Protected</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Captcha verification + rate limiting keep bots out.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Fast &amp; Free</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Complete the 2-minute form — our team follows up with details.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">All Roles Welcome</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Farmers, enterprise owners, veterinarians, feed manufacturers, investors &amp; delegates.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <ScrollReveal>
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none">
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-accent-500 to-brand-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-accent-500/20">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Registration Form</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Fill in your details &amp; secure your place.
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Open Registration
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-sm font-medium p-4 rounded-2xl border border-red-200 dark:border-red-800 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Occupation / Job <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Poultry Farmer, Feed Manufacturer, Veterinarian, Investor"
                        value={form.occupation}
                        onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                      />
                    </div>
                  </div>

                  {/* Captcha */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Security Check <span className="text-red-500">*</span>
                    </label>
                    {captcha ? (
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                            <span className="text-sm font-bold text-navy-800 dark:text-white select-none tracking-wide">{captcha.question}</span>
                          </div>
                          <input
                            type="text"
                            required
                            inputMode="numeric"
                            placeholder="Enter your answer"
                            value={captchaAnswer}
                            onChange={(e) => setCaptchaAnswer(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={loadCaptcha}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 transition-all shrink-0"
                          title="New question"
                          aria-label="Refresh captcha"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={loadCaptcha}
                        className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 font-medium"
                      >
                        <RefreshCw className="w-4 h-4" /> Load security question
                      </button>
                    )}
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                      Prevents spam and automated bots. Your details are kept confidential.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-accent-600 via-brand-600 to-accent-600 hover:from-accent-700 hover:to-brand-700 text-white font-bold text-sm px-6 py-4 rounded-2xl shadow-xl shadow-accent-600/20 dark:shadow-accent-600/10 hover:shadow-2xl transition-all duration-200 active:scale-[0.99] disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Complete Registration
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center pt-1">
                    🔒 Your personal details are kept strictly confidential and used only for conclave communication.
                  </p>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
