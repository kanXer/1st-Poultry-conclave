"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader, CreditCard, Search, Download, User, Briefcase, Phone, Mail, Hash, Send, Loader2 } from "lucide-react"
import { useToast } from "@/components/ToastProvider"

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

export default function AdminIdCards() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [emailingId, setEmailingId] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) router.push("/admin/login")
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user?.isAdmin) return
    fetch("/api/registrations")
      .then(r => r.json())
      .then(d => { if (d.registrations) setRegistrations(d.registrations) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const filtered = registrations.filter(r => {
    if (!search) return true
    const q = search.toLowerCase()
    const numPart = r.regId?.replace("FPC-GKP-", "") ?? ""
    return (
      r.name.toLowerCase().includes(q) ||
      (r.regId ?? "").toLowerCase().includes(q) ||
      numPart.includes(q) ||
      r.occupation.toLowerCase().includes(q) ||
      r.phone.includes(q)
    )
  })

  function openPrint(regId: string) {
    window.open(`/admin/id-cards/print?id=${encodeURIComponent(regId)}`, "_blank")
  }

  async function emailIdCard(r: Registration) {
    if (!r.regId || !r.email) return
    setEmailingId(r._id)
    try {
      const res = await fetch("/api/idcard/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: r.regId }),
      })
      const data = await res.json()
      if (res.ok) {
        toast(data.message || "ID card emailed")
      } else {
        toast(data.error || "Failed to email ID card")
      }
    } catch {
      toast("Network error. Please try again.")
    } finally {
      setEmailingId(null)
    }
  }

  if (authLoading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 flex items-center justify-center">
      <Loader className="w-8 h-8 animate-spin text-brand-600" />
    </div>
  )
  if (!user || !user.isAdmin) return null

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-950 py-6 sm:py-8 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-navy-800 dark:text-white flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-brand-600 shrink-0" /> Print ID Cards
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Search by name, number (001), or registration ID
            </p>
          </div>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-full px-4 py-1.5">
            Total: {registrations.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search by name, 001, FPC-GKP-001, occupation, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-brand-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700">
            <CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 dark:text-slate-500 font-medium">
              {registrations.length === 0 ? "No registrations yet." : "No results found."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(r => (
              <div
                key={r._id}
                className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              >
                {/* Badge number pill */}
                <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex flex-col items-center justify-center shadow-md">
                  <Hash className="w-3 h-3 text-amber-900 opacity-70" />
                  <span className="text-amber-900 font-black text-sm leading-none">
                    {(r.regId ?? "—").replace("FPC-GKP-", "")}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-navy-800 dark:text-white break-words">{r.name}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                      {r.regId ?? "—"}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 break-words"><Briefcase className="w-3 h-3 shrink-0" />{r.occupation}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 shrink-0" />{r.phone}</span>
                    {r.email && <span className="flex items-center gap-1 break-all"><Mail className="w-3 h-3 shrink-0" />{r.email}</span>}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(r.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => openPrint(r.regId ?? r.id)}
                    disabled={!r.regId}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    Download ID Card
                  </button>
                  <button
                    onClick={() => emailIdCard(r)}
                    disabled={!r.regId || !r.email || emailingId === r._id}
                    title={!r.email ? "No email on this registration" : "Send ID card PDF to " + r.email}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 dark:bg-navy-700 dark:hover:bg-navy-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {emailingId === r._id ? <Loader2 className="w-4 h-4 shrink-0 animate-spin" /> : <Send className="w-4 h-4 shrink-0" />}
                    Email ID Card
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
