"use client"

import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { LayoutGrid, Loader, Loader2, Image as IconImage, Users, ArrowRight, CheckCircle, UserCheck, MessageSquare, CreditCard, Star, Sparkles, CalendarDays, TrendingUp, Power, PowerOff } from "lucide-react"

interface Registration {
  _id: string
  name: string
  occupation: string
  phone: string
  timestamp: string
}

interface Enquiry {
  _id: string
  name: string
  phone: string
  email: string
  subject: string
  timestamp: string
  status?: "pending" | "completed"
}

interface Feedback {
  _id: string
  name: string
  rating: number
  category: string
  comment: string
  timestamp: string
  status?: "pending" | "completed"
}

const quickActions = [
  { icon: Users, label: "View Registrations", desc: "See all conclave registrations", href: "/admin/registrations", gradient: "from-brand-500 to-blue-600" },
  { icon: CreditCard, label: "Print ID Cards", desc: "Download & print attendee badges", href: "/admin/id-cards", gradient: "from-amber-500 to-orange-600" },
  { icon: MessageSquare, label: "Help & Enquiries", desc: "Manage contact & help requests", href: "/admin/enquiries", gradient: "from-emerald-500 to-teal-600" },
  { icon: Star, label: "View Feedback", desc: "Reviews & star ratings", href: "/admin/feedback", gradient: "from-purple-500 to-fuchsia-600" },
  { icon: LayoutGrid, label: "Gallery Manager", desc: "Manage photos & videos", href: "/admin/gallery", gradient: "from-pink-500 to-rose-600" },
  { icon: IconImage, label: "Upload Media", desc: "Add new images and videos", href: "/admin/upload", gradient: "from-cyan-500 to-sky-600" },
]

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [regOpen, setRegOpen] = useState<boolean | null>(null)
  const [regBusy, setRegBusy] = useState(false)

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) router.push("/admin/login")
  }, [user, loading, router])

  useEffect(() => {
    if (!user?.isAdmin) return
    fetch("/api/registrations").then(r => r.json()).then(d => { if (d.registrations) setRegistrations(d.registrations) }).catch(() => {})
    fetch("/api/enquiries").then(r => r.json()).then(d => { if (d.enquiries) setEnquiries(d.enquiries) }).catch(() => {})
    fetch("/api/feedback").then(r => r.json()).then(d => { if (d.feedback) setFeedback(d.feedback) }).catch(() => {})
    fetch("/api/settings/registration").then(r => r.json()).then(d => setRegOpen(d.open !== false)).catch(() => setRegOpen(true))
  }, [user])

  const toggleRegistration = async () => {
    if (regOpen === null) return
    setRegBusy(true)
    try {
      const next = !regOpen
      const res = await fetch("/api/settings/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ open: next }),
      })
      const data = await res.json()
      if (res.ok) setRegOpen(data.open !== false)
    } catch {
      // ignore
    } finally {
      setRegBusy(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-slate-100 dark:bg-navy-950 flex items-center justify-center"><Loader className="w-8 h-8 animate-spin text-brand-600" /></div>
  if (!user || !user.isAdmin) return null

  const pendingEnquiries = enquiries.filter(e => e.status !== "completed")
  const pendingFeedback = feedback.filter(f => f.status !== "completed")
  const avgRating = feedback.length ? feedback.reduce((s, f) => s + f.rating, 0) / feedback.length : 0

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 via-navy-900 to-brand-900 p-6 sm:p-8 mb-8 text-white shadow-xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-400/60 to-transparent" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-brand-300" />
            </div>
            <div className="min-w-0">
              <p className="text-brand-300 text-xs font-semibold uppercase tracking-wider">{today}</p>
              <h1 className="text-2xl sm:text-3xl font-bold mt-1">Welcome back, {user.name.split(" ")[0]} 👋</h1>
              <p className="text-slate-300 text-sm mt-1 max-w-xl">
                1st Poultry Conclave Gorakhpur 2026 — here&apos;s what&apos;s happening across your event today.
              </p>
            </div>
            <div className="sm:ml-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-brand-200">
              <CalendarDays className="w-4 h-4" /> 23 Aug 2026 · Gorakhpur
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="group bg-white dark:bg-navy-900 rounded-2xl border border-slate-200/70 dark:border-navy-800 shadow-sm p-5 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-navy-800 dark:text-white">{registrations.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Registrations</p>
            </div>
          </div>
          <div className="group bg-white dark:bg-navy-900 rounded-2xl border border-slate-200/70 dark:border-navy-800 shadow-sm p-5 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-navy-800 dark:text-white">{pendingEnquiries.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Help Requests</p>
            </div>
          </div>
          <div className="group bg-white dark:bg-navy-900 rounded-2xl border border-slate-200/70 dark:border-navy-800 shadow-sm p-5 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-navy-800 dark:text-white">{feedback.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Feedback {avgRating > 0 ? `· ${avgRating.toFixed(1)}★ avg` : ""}
              </p>
            </div>
          </div>
          <div className="group bg-white dark:bg-navy-900 rounded-2xl border border-slate-200/70 dark:border-navy-800 shadow-sm p-5 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-navy-800 dark:text-white">{pendingFeedback.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">New Feedback</p>
            </div>
          </div>
        </div>

        {/* Latest Registrations + Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200/70 dark:border-navy-800 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-navy-800">
              <h2 className="font-semibold text-navy-800 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-600" /> Latest Registrations
                {registrations.length > 0 && (
                  <span className="text-[10px] font-bold bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full">{registrations.length}</span>
                )}
              </h2>
              <Link href="/admin/registrations" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-navy-800 max-h-[300px] overflow-y-auto">
              {registrations.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8 flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> No registrations yet
                </p>
              ) : (
                registrations.slice(0, 4).map(r => (
                  <div key={r._id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-navy-800/60 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-navy-800 dark:text-slate-200 truncate">{r.name}</span>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 shrink-0">{r.occupation}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>{r.phone}</span>
                        <span>{new Date(r.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200/70 dark:border-navy-800 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-navy-800">
              <h2 className="font-semibold text-navy-800 dark:text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-500" /> Latest Feedback
                {pendingFeedback.length > 0 && (
                  <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">{pendingFeedback.length} new</span>
                )}
              </h2>
              <Link href="/admin/feedback" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-navy-800 max-h-[300px] overflow-y-auto">
              {feedback.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8 flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> No feedback yet
                </p>
              ) : (
                feedback.slice(0, 4).map(f => (
                  <div key={f._id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-navy-800/60 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-navy-800 dark:text-slate-200 truncate">{f.name}</span>
                        <span className="flex items-center gap-0.5 text-amber-500 shrink-0" title={`${f.rating} / 5`}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < f.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`} />
                          ))}
                        </span>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 shrink-0">{f.category}</span>
                        {f.status === "completed" && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 shrink-0">Done</span>
                        )}
                      </div>
                      {f.comment && <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">{f.comment}</p>}
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{new Date(f.timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Contact Help Requests */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200/70 dark:border-navy-800 shadow-sm overflow-hidden mb-8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-navy-800">
            <h2 className="font-semibold text-navy-800 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-500" /> Contact — Help Requests
              {pendingEnquiries.length > 0 && (
                <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">{pendingEnquiries.length} pending</span>
              )}
            </h2>
            <Link href="/admin/enquiries" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-navy-800 max-h-[280px] overflow-y-auto">
            {enquiries.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> No contact requests yet
              </p>
            ) : (
              enquiries.slice(0, 4).map(e => (
                <div key={e._id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-navy-800/60 transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {e.status === "completed" && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                      <span className="text-sm font-medium text-navy-800 dark:text-slate-200 truncate">{e.name}</span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 shrink-0">{e.subject}</span>
                      {e.status === "completed" && (
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 shrink-0">Done</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span>{e.phone !== "—" ? e.phone : e.email}</span>
                      <span>{new Date(e.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Registration Control */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200/70 dark:border-navy-800 shadow-sm p-5 mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20 ${regOpen === false ? "bg-gradient-to-br from-rose-500 to-red-600" : "bg-gradient-to-br from-emerald-500 to-teal-600"}`}>
              {regOpen === false ? <PowerOff className="w-5 h-5 text-white" /> : <Power className="w-5 h-5 text-white" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-navy-800 dark:text-white">Event Registration</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {regOpen === null
                  ? "Loading status…"
                  : regOpen
                    ? "Open — visitors can register on the site."
                    : "Stopped — the registration form shows a closed notice."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleRegistration}
            disabled={regBusy || regOpen === null}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md disabled:opacity-60 ${
              regOpen === false
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                : "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white"
            }`}
          >
            {regBusy ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : regOpen === false ? (
              <Power className="w-4 h-4" />
            ) : (
              <PowerOff className="w-4 h-4" />
            )}
            {regOpen === false ? "Open Registration" : "Stop Registration"}
          </button>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map(c => (
              <Link key={c.href} href={c.href}
                className="group bg-white dark:bg-navy-900 rounded-2xl p-5 border border-slate-200/70 dark:border-navy-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${c.gradient} rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                  <c.icon className="w-5.5 h-5.5 text-white" style={{ width: 22, height: 22 }} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-navy-800 dark:text-white">{c.label}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{c.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 ml-auto shrink-0 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}