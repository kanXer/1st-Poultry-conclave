'use client'

import Link from "next/link"
import { CalendarCheck, ShieldCheck, PhoneCall, ClipboardList, BadgeCheck, MapPin } from "lucide-react"
import ScrollReveal from "./ScrollReveal"

export default function RegisterCTA() {
  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-navy-900 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-brand-300/40 to-transparent dark:via-brand-700/40" />
      <div className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-bl from-brand-100/20 dark:from-brand-900/20 to-accent-100/10 dark:to-accent-900/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-gradient-to-tr from-accent-100/20 dark:from-accent-900/20 to-brand-100/10 dark:to-brand-900/10 rounded-full blur-3xl -z-10" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-navy-800 to-navy-700 dark:from-navy-900 dark:to-navy-800 p-8 md:p-12 text-center shadow-2xl dark:shadow-2xl dark:shadow-black/10">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500" />
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 text-brand-200 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/10 mb-6">
                <ShieldCheck className="w-3.5 h-3.5" />
                Limited Seats — Register Early
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                Ready to Be Part of the <span className="text-gradient">Growth Story?</span>
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-base md:text-lg">
                Register as an attendee, exhibitor, or sponsor for the 1st Poultry Conclave Gorakhpur (Edition 2026).
                Innovate, collaborate, and grow with the poultry leaders of Eastern India.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <CalendarCheck className="w-5 h-5 text-brand-400 shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Sunday, 23 August 2026</p>
                    <p className="text-[10px] text-slate-400">Save the date</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <MapPin className="w-5 h-5 text-accent-400 shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Baba Gambhirnath Auditorium</p>
                    <p className="text-[10px] text-slate-400">Taramandal, Gorakhpur</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left">
                  <ClipboardList className="w-5 h-5 text-brand-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">Easy Online Form</p>
                    <p className="text-[10px] text-slate-400">2-minute registration</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left">
                  <BadgeCheck className="w-5 h-5 text-brand-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">Spam Protected</p>
                    <p className="text-[10px] text-slate-400">Captcha + rate limit</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left">
                  <PhoneCall className="w-5 h-5 text-brand-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">Instant Confirmation</p>
                    <p className="text-[10px] text-slate-400">Our team follows up</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700 text-white font-bold text-sm px-8 py-4 rounded-full shadow-xl shadow-brand-600/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Complete Registration
                </Link>
                <a
                  href="tel:+919336212329"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-8 py-4 rounded-full border border-white/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <PhoneCall className="w-4 h-4 shrink-0" />
                  Call +91 9336212329
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
