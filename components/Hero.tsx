'use client'

import Link from "next/link"
import { CalendarCheck, MapPin, ShieldCheck, Sunrise, ChevronRight, Phone, MessageSquare, Users, TrendingUp, Microscope, Factory, PiggyBank, Handshake, Building2, Leaf, Egg } from "lucide-react"
import ScrollReveal from "./ScrollReveal"
import TextReveal from "./TextReveal"

const trustHighlights = [
  { icon: Microscope, label: "Advancing Poultry Excellence" },
  { icon: Leaf, label: "Driving Innovation & Sustainability" },
  { icon: Building2, label: "Building Opportunities for Gorakhpur" },
  { icon: Egg, label: "Better Breeding, Healthy Birds, Smart Farming" },
  { icon: TrendingUp, label: "Stronger Industry, Stronger Gorakhpur" },
]

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[80vh] md:min-h-screen pt-20 pb-20 md:pt-28 md:pb-20 overflow-hidden w-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-accent-50 dark:from-brand-950/30 dark:via-navy-900 dark:to-accent-950/30 -z-10" />
      <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-brand-200/20 to-accent-200/10 rounded-full blur-3xl -z-10 animate-pulse-slow dark:from-brand-900/20 dark:to-accent-900/10" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-accent-200/10 to-brand-200/10 rounded-full blur-3xl -z-10 animate-pulse-slow dark:from-accent-900/10 dark:to-brand-900/10" />

      {/* Decorative dotted pattern */}
      <div className="absolute top-20 right-10 opacity-[0.03] -z-10 hidden md:block" aria-hidden="true">
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-navy-800 dark:bg-navy-400" />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="max-w-2xl">
            <ScrollReveal>
              <div className="mb-6 flex justify-center md:justify-start">
                <div className="flex items-center gap-3 bg-white/80 dark:bg-navy-800/80 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg border border-brand-200 dark:border-navy-700">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white p-1 border border-brand-200 shadow-sm">
                    <img src="/logo-transparent.png" alt="1st Poultry Conclave Gorakhpur logo" className="w-full h-full object-contain" width={48} height={48} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy-800 dark:text-white leading-tight">1st Poultry Conclave</p>
                    <p className="text-[10px] text-navy-500 dark:text-navy-300 font-medium">Gorakhpur • Edition 2026</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-100 to-accent-100 text-brand-800 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-brand-200/50 shadow-sm dark:from-brand-900/40 dark:to-accent-900/40 dark:text-brand-200 dark:border-brand-800/50 dark:shadow-none">
                <Sunrise className="w-4 h-4" />
                A New Era for Poultry in Eastern UP! 🐔
              </div>
            </ScrollReveal>

            <h2 className="font-heading font-extrabold text-navy-800 dark:text-white leading-[1.1] mb-2 tracking-tight">
              <TextReveal
                text="FIRST POULTRY CONCLAVE"
                delay={200}
                stagger={45}
                className="block text-2xl sm:text-2xl md:text-3xl lg:text-4xl"
              />
              <TextReveal
                text="Gorakhpur 2026"
                delay={500}
                stagger={40}
                gradient
                className="block text-gradient text-3xl sm:text-3xl md:text-4xl lg:text-5xl"
              />
            </h2>

            <h1 className="font-heading text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-navy-800 dark:text-white leading-[1.2] mb-5 tracking-tight">
              <TextReveal text="Innovate • Collaborate • Grow" delay={950} stagger={40} />
            </h1>

            <ScrollReveal>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-5 max-w-xl">
                <strong>Uniting industry leaders — shaping a progressive future.</strong> Join the first-ever
                poultry industry conclave in <strong>Gorakhpur, Eastern UP</strong>, featuring technical seminars,
                feed technology exhibition, government finance opportunities, and B2B networking. Gorakhpur is
                rising as <strong>the poultry hub of Eastern India</strong> — be part of its growth story.
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 mb-4">
                <Link
                  href="/register"
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white font-semibold text-sm px-5 py-3 rounded-full transition-all shadow-xl shadow-brand-600/25 hover:shadow-brand-600/40 dark:shadow-brand-900/30 dark:hover:shadow-brand-900/50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  Register as Attendee
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-accent-600 to-brand-600 hover:from-accent-700 hover:to-brand-700 text-white font-semibold text-sm px-5 py-3 rounded-full transition-all shadow-lg shadow-accent-600/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  About the Event
                </Link>
                <Link
                  href="/feedback"
                  className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm px-5 py-3 rounded-full transition-all border border-slate-200 shadow-lg hover:shadow-xl dark:bg-navy-800 dark:hover:bg-navy-700 dark:text-slate-100 dark:border-navy-700 dark:shadow-lg dark:shadow-black/10 dark:hover:shadow-xl dark:hover:shadow-black/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageSquare className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                  Feedback
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
                <div className="flex items-start gap-2 bg-brand-50/70 dark:bg-brand-900/20 rounded-xl px-3.5 py-2.5 border border-brand-200/50 dark:border-brand-800/30">
                  <div className="w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <CalendarCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy-800 dark:text-white">Sunday, 23 August 2026</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Register online — attendee, exhibitor or sponsor.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-accent-50/70 dark:bg-accent-900/20 rounded-xl px-3.5 py-2.5 border border-accent-200/50 dark:border-accent-800/30">
                  <div className="w-6 h-6 bg-accent-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy-800 dark:text-white">Baba Gambhirnath Auditorium</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Taramandal • Gorakhpur, India • 23 Aug 2026</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-emerald-50/70 dark:bg-emerald-900/20 rounded-xl px-3.5 py-2.5 border border-emerald-200/50 dark:border-emerald-800/30">
                  <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy-800 dark:text-white">Farmers to Leaders</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Farmers, enterprises, vets, investors &amp; delegates.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-slate-200 dark:bg-navy-800/70 dark:shadow-lg dark:shadow-black/10 dark:border-navy-700">
                {trustHighlights.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Event Card */}
          <div className="flex justify-center items-start relative pt-4 md:pt-4">
            <ScrollReveal>
              <div className="relative w-full max-w-sm overflow-hidden">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-brand-200/20 to-accent-200/20 rounded-full blur-2xl dark:from-brand-900/20 dark:to-accent-900/20" />
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-navy-800 to-navy-700 dark:from-navy-900 dark:to-navy-800 shadow-2xl border-4 border-white/80 dark:border-navy-700 dark:shadow-2xl dark:shadow-black/20 p-8">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500" />
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white p-1.5 border border-brand-200 shadow-lg mb-4">
                      <img src="/logo-transparent.png" alt="1st Poultry Conclave Gorakhpur logo" className="w-full h-full object-contain" width={64} height={64} />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-300 mb-1">1st Poultry Conclave</p>
                    <h3 className="text-2xl font-extrabold text-white leading-tight">Gorakhpur 2026</h3>
                    <p className="text-brand-200 text-sm mt-1">Innovate • Collaborate • Grow</p>
                    <div className="mt-4 space-y-2">
                      <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 border border-white/10">
                        <CalendarCheck className="w-3.5 h-3.5 text-brand-400" />
                        <span className="text-xs font-semibold text-white">Sunday, 23 August 2026 • 9:00 AM to 4:00 PM</span>
                      </div>
                      <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 border border-white/10">
                        <MapPin className="w-3.5 h-3.5 text-accent-400" />
                        <span className="text-xs font-semibold text-white">Baba Gambhirnath Auditorium, Taramandal, Gorakhpur</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { icon: Microscope, title: "Advancing Poultry Excellence", sub: "Technical Seminars • Bird Health & Bio-Security" },
                      { icon: Leaf, title: "Driving Innovation & Sustainability", sub: "Feed Technology & Smart Equipment Expo" },
                      { icon: Building2, title: "Building Opportunities for Gorakhpur", sub: "Subsidies, Bank Finance & Investment" },
                      { icon: Egg, title: "Better Breeding, Healthy Birds, Smart Farming", sub: "Modern Genetics • Flock Health • Smart Sheds" },
                      { icon: TrendingUp, title: "Stronger Industry, Stronger Gorakhpur", sub: "B2B Networking • Investor Summit • Growth" },
                    ].map((t) => (
                      <div key={t.title} className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl px-3.5 py-2.5 transition-all border border-white/10">
                        <t.icon className="w-5 h-5 text-brand-400 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-white leading-tight">{t.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{t.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Link
                      href="/register"
                      className="group relative overflow-hidden flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-500 to-accent-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
                      <CalendarCheck className="w-3.5 h-3.5" /> Register
                    </Link>
                    <a
                      href="tel:+919336212329"
                      className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-3 rounded-xl transition-all"
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" /> +91 9336212329
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <ScrollReveal>
          <div className="mt-12 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-navy-800/80 backdrop-blur-sm rounded-full pl-3 pr-4 py-2 shadow-md border border-brand-200/60 dark:border-navy-700">
              <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                Organised by:{" "}
                <span className="font-bold text-navy-800 dark:text-white">
                  Department of Animal Husbandry, Gorakhpur Division, Gorakhpur
                </span>
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
