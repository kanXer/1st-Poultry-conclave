"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader, MessageSquare, X, Trash2, Phone, Mail, Filter, CheckCircle, Send } from "lucide-react"
import { useToast } from "@/components/ToastProvider"

interface Enquiry {
  _id: string
  name: string
  phone: string
  email: string
  subject: string
  message: string
  timestamp: string
  status?: "pending" | "completed"
}

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Name A–Z", value: "name_az" },
  { label: "Name Z–A", value: "name_za" },
  { label: "Subject A–Z", value: "sub_az" },
  { label: "Subject Z–A", value: "sub_za" },
]

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [sort, setSort] = useState("newest")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Enquiry | null>(null)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) router.push("/admin/login")
  }, [user, authLoading, router])

  async function fetchEnquiries() {
    try {
      const res = await fetch("/api/enquiries")
      const data = await res.json()
      if (data.enquiries) setEnquiries(data.enquiries)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (user) fetchEnquiries() }, [user])

  async function deleteEnquiry(id: string) {
    if (!confirm("Delete this enquiry?")) return
    try {
      const res = await fetch(`/api/enquiries?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        toast("Enquiry deleted")
        fetchEnquiries()
        setSelected(null)
      }
    } catch {}
  }

  async function completeEnquiry(id: string) {
    if (!confirm("Mark this request as resolved and notify the customer via email?")) return
    try {
      const res = await fetch("/api/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (res.ok) {
        toast(data.message || "Request marked as resolved")
        fetchEnquiries()
        setSelected(null)
      } else {
        toast(data.error || "Failed to resolve request")
      }
    } catch {}
  }

  const filtered = enquiries.filter(e =>
    !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.phone.includes(search) || e.subject.toLowerCase().includes(search.toLowerCase())
  )
  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "oldest": return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      case "name_az": return a.name.localeCompare(b.name)
      case "name_za": return b.name.localeCompare(a.name)
      case "sub_az": return a.subject.localeCompare(b.subject)
      case "sub_za": return b.subject.localeCompare(a.subject)
      default: return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }
  })

  if (authLoading) return <div className="min-h-screen bg-slate-50 dark:bg-navy-900 flex items-center justify-center"><Loader className="w-8 h-8 animate-spin text-brand-600" /></div>
  if (!user || !user.isAdmin) return null

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-950 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-navy-800 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-brand-600" /> Enquiries &amp; Help
            </h1>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-800 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 shrink-0">
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <input type="text" placeholder="Search by name, phone or subject..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full mt-3 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-600 bg-slate-50 dark:bg-navy-900 text-navy-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader className="w-8 h-8 animate-spin text-brand-600" /></div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">No enquiries or help requests yet.</div>
        ) : (
          <div className="space-y-3">
            {sorted.map((e) => (
              <div key={e._id} onClick={() => setSelected(e)}
                className="bg-white dark:bg-navy-800 rounded-xl p-5 border border-slate-200 dark:border-navy-700 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {e.status === "completed" && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                    <div>
                      <h3 className="font-semibold text-navy-800 dark:text-white">{e.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{e.phone}</p>
                      {e.email && e.email !== "—" && <p className="text-sm text-slate-400 dark:text-slate-500">{e.email}</p>}
                    </div>
                  </div>
                  <div className="text-right flex items-start gap-2">
                    {e.status === "completed" && <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">Done</span>}
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 border border-accent-200 dark:border-accent-800">
                      {e.subject}
                    </span>
                  </div>
                </div>
                {e.message && e.message !== "—" && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{e.message}</p>
                )}
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  {new Date(e.timestamp).toLocaleString("en-IN")}
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

            <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-5">{selected.name}</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="w-4 h-4 text-brand-600" /> {selected.phone}
              </div>
              {selected.email && selected.email !== "—" && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-brand-600" /> {selected.email}
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Filter className="w-4 h-4 text-brand-600" /> {selected.subject}
              </div>
              {selected.message && selected.message !== "—" && (
                <div className="pt-3 border-t border-slate-100 dark:border-navy-700">
                  <p className="font-medium text-navy-800 dark:text-white mb-1">Message</p>
                  <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{selected.message}</p>
                </div>
              )}
              <div className="pt-3 border-t border-slate-100 dark:border-navy-700 text-xs text-slate-400">
                Received on {new Date(selected.timestamp).toLocaleString("en-IN")}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-navy-700 flex flex-col sm:flex-row gap-2">
              {selected.status !== "completed" && (
                <button onClick={() => completeEnquiry(selected._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all">
                  <Send className="w-4 h-4" /> Mark Resolved &amp; Notify
                </button>
              )}
              <button onClick={() => deleteEnquiry(selected._id)}
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
