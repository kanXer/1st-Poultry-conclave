import { Phone, MapPin, CalendarCheck } from "lucide-react"
import { FaFacebook, FaInstagram } from "react-icons/fa"
import Link from "next/link"

export default function TopBar() {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/1stpoultryconclave"
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/1stpoultryconclave"
  return (
    <>
      <div className="hidden md:block bg-navy-800 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9">
            <div className="flex items-center gap-4">
              <a
                href="tel:+919336212329"
                className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contact: +91 9336212329</span>
              </a>
              <span className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>Baba Gambhirnath Auditorium, Taramandal, Gorakhpur</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Sunday, 23 August 2026</span>
              </span>
              <span className="text-slate-600">|</span>
              <Link
                href="/register"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Register for the Conclave</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Edition 2026</span>
              <span className="text-slate-600">|</span>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-pink-400 transition-colors"
              >
                Instagram
              </a>
              <span className="text-slate-600">|</span>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-navy-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-navy-700 shadow-2xl">
        <div className="flex items-center gap-2 px-3 py-2">
          <Link
            href="/register"
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-accent-600 text-white text-sm font-semibold py-3 rounded-xl shadow-md active:scale-[0.97] transition-transform"
          >
            <CalendarCheck className="w-4 h-4" />
            Register Now
          </Link>
          <Link
            href="/feedback"
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-navy-700 to-navy-800 dark:from-navy-700 dark:to-navy-600 text-white text-sm font-semibold py-3 rounded-xl shadow-md active:scale-[0.97] transition-transform"
          >
            <Phone className="w-4 h-4" />
            Feedback
          </Link>
        </div>
      </div>
    </>
  )
}
