"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
  isSuperAdmin?: boolean
  adminProof?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  /** True once admin proof has been verified (only checked on admin pages) */
  adminVerified: boolean
  adminVerifying: boolean
  /** Call this on admin pages to verify the HMAC proof server-side */
  verifyAdmin: () => Promise<boolean>
  login: (email: string, password: string) => Promise<string | null>
  register: (email: string, password: string, name?: string) => Promise<string | null>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminVerified, setAdminVerified] = useState(false)
  const [adminVerifying, setAdminVerifying] = useState(false)

  async function refresh() {
    try {
      const res = await fetch("/api/auth/me")
      const data = await res.json()
      setUser(data.user ?? null)
      setAdminVerified(false) // reset on refresh
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  /**
   * Lazy admin proof verification — only called when admin pages load.
   * Regular pages never make this extra call, keeping them fast.
   */
  const verifyAdmin = useCallback(async (): Promise<boolean> => {
    if (adminVerified) return true
    if (!user?.isAdmin) return false

    // No proof = tampered response
    if (!user.adminProof) {
      setUser((prev) => prev ? { ...prev, isAdmin: false } : null)
      return false
    }

    setAdminVerifying(true)
    try {
      const res = await fetch("/api/auth/verify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, adminProof: user.adminProof }),
      })
      const data = await res.json()
      if (data.valid === true) {
        setAdminVerified(true)
        return true
      } else {
        // Proof invalid — tampered response, deny admin
        setUser((prev) => prev ? { ...prev, isAdmin: false, adminProof: undefined } : null)
        setAdminVerified(false)
        return false
      }
    } catch {
      return false
    } finally {
      setAdminVerifying(false)
    }
  }, [user, adminVerified])

  async function login(email: string, password: string): Promise<string | null> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) return data.error || "Login failed"
    setUser(data.user)
    setAdminVerified(false) // will be verified lazily on admin pages
    return null
  }

  async function register(email: string, password: string, name?: string): Promise<string | null> {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })
    const data = await res.json()
    if (!res.ok) return data.error || "Registration failed"
    setUser(data.user)
    return null
  }

  async function logoutUser() {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    setAdminVerified(false)
  }

  return (
    <AuthContext.Provider value={{ user, loading, adminVerified, adminVerifying, verifyAdmin, login, register, logout: logoutUser, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

