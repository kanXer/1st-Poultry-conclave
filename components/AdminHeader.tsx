"use client"

import Link from "next/link"
import { useAuth } from "./AuthProvider"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Shield, LayoutDashboard, Image as ImageIcon, LogOut, Menu, X, Upload, Users } from "lucide-react"

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Registrations", href: "/admin/registrations", icon: Users },
  { label: "Print IDs", href: "/admin/id-cards", icon: Shield },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Upload", href: "/admin/upload", icon: Upload },
]

export default function AdminHeader() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!user?.isAdmin) return null

  async function handleLogout() {
    await logout()
    router.push("/")
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border-b border-navy-700/50 shadow-lg shadow-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 h-12 sm:h-14 text-sm">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold shrink-0">
            <div className="w-7 h-7 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
            <span className="text-sm sm:text-base tracking-wide">Admin</span>
          </div>

          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Admin navigation">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all shrink-0 text-xs xl:text-[13px] ${
                  isActive(link.href)
                    ? "bg-amber-500/15 text-amber-300 shadow-inner"
                    : "text-navy-300 hover:text-amber-300 hover:bg-amber-500/10"
                }`}
              >
                <link.icon className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto shrink-0 flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-navy-300 hover:text-amber-300 hover:bg-amber-500/10"
              aria-label={menuOpen ? "Close admin menu" : "Open admin menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/"
              className="text-xs sm:text-sm text-navy-300 hover:text-amber-300 transition-colors font-medium">
              View Site
            </Link>
            <button onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1.5 sm:py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all font-medium text-xs sm:text-sm">
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden pb-3 border-t border-navy-700/50 pt-2 space-y-1" role="navigation" aria-label="Mobile admin navigation">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg font-medium transition-colors text-sm ${
                  isActive(link.href)
                    ? "bg-amber-500/15 text-amber-300"
                    : "text-navy-300 hover:text-amber-300 hover:bg-amber-500/10"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex gap-2">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-amber-500/15 text-amber-300 font-medium text-sm"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-red-900/30 text-red-300 font-medium text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}