"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import {
  Loader,
  LayoutGrid,
  Users,
  CreditCard,
  MessageSquare,
  Star,
  Image as ImageIcon,
  Upload,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Globe,
  Settings,
} from "lucide-react"
import Link from "next/link"
import AdminUserSettings from "@/components/AdminUserSettings"

const publicAdminPaths = ["/admin/login", "/admin/register", "/admin/id-cards/print"]

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/registrations", label: "Registrations", icon: Users },
  { href: "/admin/id-cards", label: "ID Cards", icon: CreditCard },
  { href: "/admin/enquiries", label: "Help & Enquiries", icon: MessageSquare },
  { href: "/admin/feedback", label: "Feedback", icon: Star },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/upload", label: "Upload Media", icon: Upload },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, adminVerified, adminVerifying, verifyAdmin, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [verified, setVerified] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const isPublic = publicAdminPaths.some(p => pathname === p || pathname.startsWith(p))

  // Lazy admin proof verification — only triggers on admin pages
  useEffect(() => {
    if (loading || isPublic) return
    if (!user || !user.isAdmin) {
      router.push("/admin/login")
      return
    }
    // Verify admin proof server-side (one-time, cached)
    verifyAdmin().then((ok) => {
      if (!ok) {
        router.push("/admin/login")
      } else {
        setVerified(true)
      }
    })
  }, [user, loading, isPublic, router, verifyAdmin])

  // Redirect logged-in admin away from public auth pages
  useEffect(() => {
    if (loading) return
    if (user?.isAdmin && isPublic && adminVerified) {
      router.push("/admin")
    }
  }, [user, loading, isPublic, router, adminVerified])

  // Close mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  if (loading || adminVerifying) return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 flex items-center justify-center">
      <Loader className="w-8 h-8 animate-spin text-brand-600" />
    </div>
  )

  const isPrintPage = pathname.startsWith("/admin/id-cards/print")
  if (isPrintPage) return <>{children}</>
  if (isPublic) return <>{children}</>

  if (!user || !user.isAdmin || !verified) return null

  const initials = user.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "AD"

  const sidebar = (
    <div className="flex flex-col h-full w-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg shadow-brand-900/40 shrink-0 overflow-hidden border border-brand-200/60">
          <img src="/logo-transparent.png" alt="1st Poultry Conclave Gorakhpur logo" className="w-full h-full object-contain" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold text-sm leading-tight truncate">Poultry Conclave</p>
          <p className="text-brand-300/80 text-[10px] uppercase tracking-wider mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link key={item.href} href={item.href}
              className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-brand-500/90 to-accent-600/90 text-white shadow-lg shadow-brand-900/30"
                  : "text-slate-300/80 hover:text-white hover:bg-white/5"
              }`}>
              <item.icon size={18} className={`shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-brand-300"}`} />
              <span className="truncate">{item.label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-2 border-t border-white/10 pt-4">
        <Link href="/" target="_blank"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300/80 hover:text-white hover:bg-white/5 transition-all">
          <Globe size={18} className="text-slate-400" />
          <span>View Live Site</span>
          <ExternalLink className="ml-auto w-3.5 h-3.5 text-slate-500" />
        </Link>
        <div className="flex items-center gap-3 px-3.5 py-2.5 cursor-pointer" onClick={() => setSettingsOpen(true)} title={user.isSuperAdmin ? "Open account settings" : "Change password"}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-semibold truncate">{user.name}</p>
            <p className="text-slate-400 text-[10px]">{user.isSuperAdmin ? "Super Admin" : "Admin"}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setSettingsOpen(true); }} title="Account settings"
            className="p-2 rounded-lg text-slate-400 hover:text-brand-300 hover:bg-white/5 transition-all">
            <Settings size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); logout(); }} title="Logout"
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-all">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-950">
      {/* Mobile navbar */}
      <div className="lg:hidden sticky top-0 z-40 bg-navy-900 dark:bg-navy-950 border-b border-navy-800/60">
        <div className="flex items-center gap-1.5 px-3 h-14">
          <button onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label="Open admin menu">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shadow-lg shadow-brand-900/40 shrink-0 overflow-hidden border border-brand-200/60">
              <img src="/logo-transparent.png" alt="1st Poultry Conclave Gorakhpur logo" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0 hidden sm:block">
              <p className="text-white font-bold text-sm leading-tight truncate">Poultry Conclave</p>
              <p className="text-brand-300/80 text-[9px] uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 ml-auto shrink-0">
            <Link href="/" target="_blank"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-brand-200 hover:bg-white/10 hover:text-white transition-all">
              <Globe size={14} /> Visit Site
            </Link>
            <button onClick={logout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-start">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 bg-navy-900 dark:bg-navy-950 border-r border-navy-800/60 sticky top-0 h-screen overflow-y-auto">
          {sidebar}
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-navy-900 dark:bg-navy-950 shadow-2xl animate-fade-in">
            <button onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <AdminUserSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}