"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trash2, Loader, User, Briefcase, Phone, Mail, CalendarDays, Users, Search, X } from "lucide-react"
import { useToast } from "@/components/ToastProvider"

interface Registration {
  _id: string
  id: string
  name: string
  occupation: string
  phone: string
  email: string
  timestamp: string
}

export default function AdminRegistrations() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) router.push("/admin/login")
  }, [user, authLoading, router])

  function fetchRegistrations() {
    fetch("/api/registrations")
      .then((r) => r.json())
      .then((d) => { if (d.registrations) setRegistrations(d.registrations) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { if (user) fetchRegistrations() }, [user])

  async function deleteItem(id: string) {
    if (!confirm("Delete this registration?")) return
    await fetch(`/api/registrations?id=${id}`, { method: "DELETE" })
    toast("Deleted")
    fetchRegistrations()
  }

  if (authLoading) return <div className="min-h-screen bg-slate-50 dark:bg-navy-900 flex items-center justify-center"><Loader className="w-8 h-8 animate-spin text-brand-600" /></div>
  if (!user || !user.isAdmin) return null

  const q = query.trim().toLowerCase()
  const filtered = q
    ? registrations.filter(r =>
        [r.name, r.occupation, r.phone, r.email, r.id].some(f => (f || "").toLowerCase().includes(q))
      )
    : registrations

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-950 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-navy-800 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" /> Conclave Registrations
          </h1>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-full px-4 py-1.5">
            Total: {registrations.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, occupation, phone, email or ID..."
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
          <div className="text-center py-24 bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 dark:text-slate-500 font-medium">{q ? "No registrations match your search." : "No registrations yet."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((r) => (
              <div key={r._id} className="bg-white dark:bg-navy-800 rounded-2xl p-5 border border-slate-200 dark:border-navy-700 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-accent-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-navy-800 dark:text-white text-sm">{r.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" /> {new Date(r.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => deleteItem(r._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5 text-sm">
                  <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Briefcase className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                    {r.occupation || "—"}
                  </p>
                  <a href={`tel:${r.phone}`} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-brand-600">
                    <Phone className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                    {r.phone}
                  </a>
                  {r.email && (
                    <a href={`mailto:${r.email}`} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-brand-600">
                      <Mail className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                      {r.email}
                    </a>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-3">ID: {r.id}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}