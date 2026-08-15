"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader, ShieldAlert, CheckCircle } from "lucide-react"

export default function AdminRegister() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) { setError(data.error || "Registration failed"); return }
      setDone(true)
    } catch {
      setLoading(false)
      setError("Network error. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {done ? (
          <div className="bg-white dark:bg-navy-800 rounded-2xl p-8 border border-slate-200 dark:border-navy-700 shadow-xl text-center">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-2">Registration Successful!</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Please login with your credentials to access the admin panel.</p>
            <Link href="/admin/login"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all">
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-navy-800 dark:text-white">Admin Register</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create your admin account</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-slate-200 dark:border-navy-700 shadow-xl space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-white mb-1.5">Name (optional)</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-white mb-1.5">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-white mb-1.5">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-60">
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Create Account
              </button>
              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link href="/admin/login" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">Sign In</Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
