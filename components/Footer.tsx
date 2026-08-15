import Link from "next/link"
import { Phone, MapPin, Mail, CalendarCheck } from "lucide-react"
import { FaInstagram, FaFacebook } from "react-icons/fa"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About the Conclave", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
  { label: "Register Now", href: "/register" },
]

const agendaTracks = [
  "Technical Seminars on Bird Health & Bio-Security",
  "Feed Technology & Smart Poultry Equipment Exhibition",
  "Government Subsidies, Bank Finance & Investment",
  "B2B Networking & Investor Summit",
]

export default function Footer() {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/1stpoultryconclave"
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/1stpoultryconclave"
  return (
    <footer className="bg-navy-800 dark:bg-navy-950 text-slate-300 dark:text-slate-400 relative overflow-hidden">
      {/* Top Border & Decorative Blur Effects */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-brand-500/5 to-accent-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tl from-accent-500/5 to-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 pb-20 md:pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center sm:text-left">

          {/* Column 1: Logo & About */}
          <div className="md:col-span-1 flex flex-col items-center sm:items-start">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-4 w-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white p-1.5 shadow-lg border border-brand-200">
                  <img src="/logo-transparent.png" alt="1st Poultry Conclave Gorakhpur logo" className="w-full h-full object-contain" width={48} height={48} />
                </div>
                <div className="text-left">
                  <p className="text-base font-bold text-white leading-tight">1st Poultry Conclave</p>
                  <p className="text-xs text-brand-300">Gorakhpur • Edition 2026</p>
                </div>
              </div>
            <p className="text-sm leading-relaxed text-slate-400 dark:text-slate-500 max-w-sm sm:max-w-none">
              Innovate • Collaborate • Grow. Advancing poultry excellence, driving innovation
              &amp; sustainability, and building opportunities for Gorakhpur — the rising
              poultry hub of Eastern India.
            </p>

            {/* Social Links */}
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-5 w-full">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-800/50 dark:bg-slate-900/50 text-slate-400 hover:text-pink-400 hover:bg-slate-800 transition-all transform hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-800/50 dark:bg-slate-900/50 text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all transform hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-brand-500/30 pb-1 inline-block sm:border-none">
              Quick Links
            </h4>
            <ul className="space-y-2.5 w-full">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-slate-200 transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Agenda Tracks */}
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-brand-500/30 pb-1 inline-block sm:border-none">
              Conclave Tracks
            </h4>
            <ul className="space-y-2 text-sm text-slate-400 dark:text-slate-500 w-full">
              {agendaTracks.map((track) => (
                <li key={track} className="hover:text-slate-200 dark:hover:text-slate-300 transition-colors">
                  {track}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-brand-500/30 pb-1 inline-block sm:border-none">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm text-slate-400 dark:text-slate-500 w-full flex flex-col items-center sm:items-start">
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2 max-w-xs sm:max-w-none">
                <MapPin className="w-4 h-4 text-brand-400 dark:text-brand-300 shrink-0 mt-0.5" />
                <span className="text-center sm:text-left">
                  Baba Gambhirnath Auditorium, Taramandal
                  <br />
                  Gorakhpur, Uttar Pradesh, India
                </span>
              </li>
              <li>
                <span className="flex items-center gap-2 justify-center sm:justify-start">
                  <CalendarCheck className="w-4 h-4 text-brand-400 dark:text-brand-300 shrink-0" />
                  Sunday, 23 August 2026
                </span>
              </li>
              <li>
                <a
                  href="tel:+919336212329"
                  className="flex items-center gap-2 hover:text-white dark:hover:text-slate-200 transition-colors group justify-center sm:justify-start"
                >
                  <Phone className="w-4 h-4 text-brand-400 dark:text-brand-300 shrink-0 group-hover:scale-110 transition-transform" />
                  +91 9336212329
                </a>
              </li>
              <li>
                <a
                  href="mailto:sanjayjp23@gmail.com"
                  className="flex items-center gap-2 hover:text-white dark:hover:text-slate-200 transition-colors break-all group justify-center sm:justify-start"
                >
                  <Mail className="w-4 h-4 text-brand-400 dark:text-brand-300 shrink-0 group-hover:scale-110 transition-transform" />
                  sanjayjp23@gmail.com
                </a>
              </li>
              <li>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-accent-600 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  Complete Registration
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-navy-700 dark:border-navy-600 mt-12 pt-8 flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} 1st Poultry Conclave Gorakhpur. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 flex-wrap">
            Empowering Gorakhpur Through Poultry Progress — Edition 2026.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 flex-wrap">
            Created by{" "}
            <a
              href="https://nexusdigitalmarketing.shop/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
              Nexus Digital Marketing Agency
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
