"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader, Star, ArrowLeft, X, Trash2, CheckCircle, Search } from "lucide-react"
import { useToast } from "@/components/ToastProvider"

interface FeedbackItem {
  _id: string
  name: string
  rating: number
  category: string
  comment: string
  timestamp: string
  status?: "pending" | "completed"
}

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<FeedbackItem | null>(null)
  const [query, setQuery] = useState("")
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) router.push("/admin/login")
  }, [user, authLoading, router])

  async function fetchFeedback() {
    try {
      const res = await fetch("/api/feedback")
      const data = await res.json()
      if (data.feedback) setFeedback(data.feedback)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (user) fetchFeedback() }, [user])

  async function deleteFeedback(id: string) {
    if (!confirm("Delete this feedback?")) return
    try {
      const res = await fetch(`/api/feedback?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        toast("Feedback deleted")
        fetchFeedback()
        setSelected(null)
      }
    } catch {}
  }

  async function resolveFeedback(id: string) {
    try {
      const res = await fetch("/api/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (res.ok) {
        toast(data.message || "Feedback marked as resolved")
        fetchFeedback()
        setSelected(null)
      } else {
        toast(data.error || "Failed to mark feedback as resolved")
      }
    } catch {}
  }

  if (authLoading) return <div className="min-h-screen bg-slate-50 dark:bg-navy-900 flex items-center justify-center"><Loader className="w-8 h-8 animate-spin text-brand-600" /></div>
  if (!user || !user.isAdmin) return null

  const q = query.trim().toLowerCase()
  const filtered = q
    ? feedback.filter(f =>
        [f.name, f.category, f.comment].some(v => (v || "").toLowerCase().includes(q))
      )
    : feedback

  const avgRating = feedback.length ? feedback.reduce((s, f) => s + f.rating, 0) / feedback.length : 0
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  feedback.forEach(f => { counts[f.rating] = (counts[f.rating] || 0) + 1 })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold text-navy-800 dark:text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500" /> Feedback
          </h1>
          {feedback.length > 0 && (
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2">
              {feedback.length} reviews • {avgRating.toFixed(1)}★ average
            </span>
          )}
        </div>

        {/* Rating summary */}
        {feedback.length > 0 && (
          <div className="bg-white dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 shadow-sm p-5 mb-6">
            <div className="grid grid-cols-5 gap-3 text-center">
              {[5, 4, 3, 2, 1].map(n => (
                <div key={n} className="px-2 py-3 rounded-lg bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-700">
                  <div className="flex items-center justify-center gap-1 text-amber-500">
                    <Star className={`w-4 h-4 ${n >= 1 ? "fill-amber-400 text-amber-400" : ""}`} />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{n}</span>
                  </div>
                  <p className="text-xl font-bold text-navy-800 dark:text-white mt-1">{counts[n] || 0}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, category or comment..."
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-sm text-navy-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-brand-500/50 shadow-sm transition-all"
          />
          {query && (
            <button onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-navy-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-700 transition-all">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader className="w-8 h-8 animate-spin text-brand-600" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">{q ? "No feedback matches your search." : "No feedback yet."}</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(f => (
              <div key={f._id} onClick={() => setSelected(f)}
                className="bg-white dark:bg-navy-800 rounded-xl p-5 border border-slate-200 dark:border-navy-700 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {f.status === "completed" && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                    <div>
                      <h3 className="font-semibold text-navy-800 dark:text-white">{f.name}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < f.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-start gap-2">
                    {f.status === "completed" && <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">Done</span>}
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 border border-accent-200 dark:border-accent-800">
                      {f.category}
                    </span>
                  </div>
                </div>
                {f.comment && <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{f.comment}</p>}
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  {new Date(f.timestamp).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-navy-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-navy-700 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-800 dark:text-white">{selected.name}</h2>
                <div className="flex items-center gap-1 mt-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < selected.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`} />
                  ))}
                  <span className="text-xs font-semibold text-slate-500 ml-1">{selected.rating}/5</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 border border-accent-200 dark:border-accent-800 text-xs font-semibold">
                {selected.category}
              </div>
              {selected.comment && (
                <div className="pt-2">
                  <p className="font-medium text-navy-800 dark:text-white mb-1">Comment</p>
                  <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{selected.comment}</p>
                </div>
              )}
              <div className="pt-3 border-t border-slate-100 dark:border-navy-700 text-xs text-slate-400">
                Submitted on {new Date(selected.timestamp).toLocaleString("en-IN")}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-navy-700 flex flex-col sm:flex-row gap-2">
              {selected.status !== "completed" && (
                <button onClick={() => resolveFeedback(selected._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all">
                  <CheckCircle className="w-4 h-4" /> Mark Resolved
                </button>
              )}
              <button onClick={() => deleteFeedback(selected._id)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
