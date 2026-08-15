'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, CalendarCheck, CalendarDays, MapPin, Phone, User, ShieldCheck, Home, Info, Images, Mail, ChevronRight } from "lucide-react"
import { useAuth } from "./AuthProvider"
import ThemeToggle from "./ThemeToggle"

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: Info },
  { label: "Gallery", href: "/gallery", icon: Images },
  { label: "Contact", href: "/contact", icon: Mail },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 bg-white/85 dark:bg-navy-900/85 backdrop-blur-2xl border-b transition-all duration-300 ${
        scrolled
          ? "border-slate-200/80 dark:border-navy-700/80 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          : "border-slate-200/50 dark:border-navy-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
      }`}
      ref={(el) => {
        if (el) document.documentElement.style.setProperty("--header-height", el.offsetHeight + "px")
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group" aria-label="1st Poultry Conclave Gorakhpur — Home">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white p-1.5 shadow-lg shadow-brand-600/20 border border-brand-200 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <img src="/logo-transparent.png" alt="1st Poultry Conclave Gorakhpur logo" className="w-full h-full object-contain" width={48} height={48} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm sm:text-base md:text-lg font-bold text-navy-800 dark:text-white tracking-tight block leading-tight">
                1st Poultry <span className="text-gradient">Conclave</span>
              </span>
              <span className="block sm:hidden text-[9px] text-navy-500 dark:text-navy-300 font-medium leading-tight truncate">
                Sun, 23 Aug 2026 • Taramandal, Gorakhpur
              </span>
              <span className="hidden sm:block text-[10px] md:text-[11px] text-navy-500 dark:text-navy-300 font-medium leading-tight truncate">
                Sunday, 23 Aug 2026 • Baba Gambhirnath Auditorium, Taramandal • Edition 2026
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
                  isActive(link.href)
                    ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-navy-800"
                    : "text-navy-600 dark:text-navy-200 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-navy-50 dark:hover:bg-navy-800"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Link
              href="/register"
              className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all shadow-lg shadow-brand-600/25 hover:scale-105 hover:shadow-brand-600/35 active:scale-95"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Register Now</span>
            </Link>
            <Link
              href={user?.isAdmin ? "/admin" : "/admin/login"}
              className={`p-2 rounded-full transition-colors ${isActive("/admin")
                ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-navy-800"
                : "text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-navy-50 dark:hover:bg-navy-800"
                }`}
              aria-label={user?.isAdmin ? "Admin Dashboard" : "Admin Login"}
              title={user?.isAdmin ? "Admin Dashboard" : "Admin Login"}
            >
              {user?.isAdmin ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </Link>
            <button
              className="lg:hidden p-2 text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="lg:hidden border-t border-slate-200/70 dark:border-navy-700/70 bg-white/95 dark:bg-navy-900/95 backdrop-blur-2xl animate-slide-down"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="px-4 py-4 space-y-1">
            <div className="mb-2 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-50 to-accent-50 dark:from-navy-800 dark:to-navy-800/60 border border-brand-100 dark:border-navy-700 space-y-1.5">
              <p className="flex items-center gap-2 text-xs font-semibold text-brand-700 dark:text-brand-300">
                <CalendarDays className="w-4 h-4 shrink-0" />
                Sunday, 23 August 2026
              </p>
              <p className="flex items-center gap-2 text-xs font-medium text-navy-600 dark:text-navy-200">
                <MapPin className="w-4 h-4 shrink-0 text-brand-600 dark:text-brand-400" />
                Baba Gambhirnath Auditorium, Taramandal, Gorakhpur
              </p>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between text-sm font-medium py-3 px-4 rounded-xl transition-colors ${
                  isActive(link.href)
                    ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-navy-800"
                    : "text-navy-700 dark:text-navy-200 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-navy-50 dark:hover:bg-navy-800"
                }`}
              >
                <span className="flex items-center gap-3">
                  <link.icon className="w-4 h-4 text-navy-400 dark:text-navy-500" />
                  {link.label}
                </span>
                <ChevronRight className="w-4 h-4 text-navy-300 dark:text-navy-500" />
              </Link>
            ))}
            <div className="pt-3 flex gap-2">
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-accent-600 text-white text-sm font-semibold px-4 py-3 rounded-full transition-all shadow-lg shadow-brand-600/20"
              >
                <CalendarCheck className="w-4 h-4" />
                Register Now
              </Link>
              <Link
                href="/feedback"
                onClick={() => setOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-navy-700 to-navy-800 text-white text-sm font-semibold px-4 py-3 rounded-full transition-all"
              >
                <Phone className="w-4 h-4" />
                Feedback
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
