'use client'

import { useState } from "react"
import { Stethoscope, Factory, Landmark, TrendingUp, Egg, CalendarCheck, MapPin } from "lucide-react"
import Link from "next/link"
import ScrollReveal from "./ScrollReveal"

const tracks = [
  {
    icon: Stethoscope,
    track: "Focus Area 1",
    title: "Advancing Poultry Excellence",
    desc: "Technical seminars on bird health, bio-security, vaccination protocols, and flock health management with veterinary experts — setting higher quality standards across the region.",
    highlights: ["Disease prevention strategies", "Vaccination schedules", "Flock health management"],
  },
  {
    icon: Factory,
    track: "Focus Area 2",
    title: "Driving Innovation & Sustainability",
    desc: "Explore the latest feed formulations, automated systems, climate-controlled sheds, and IoT-enabled smart poultry equipment for a more efficient and sustainable future.",
    highlights: ["Feed formulation", "Automation & IoT", "Smart shed technology"],
  },
  {
    icon: Landmark,
    track: "Focus Area 3",
    title: "Building Opportunities for Gorakhpur",
    desc: "Government subsidies, bank finance, and investment opportunities that empower local farmers, enterprises, and the wider regional poultry economy.",
    highlights: ["Govt. subsidies", "Bank finance", "Investment options"],
  },
  {
    icon: Egg,
    track: "Focus Area 4",
    title: "Better Breeding, Healthy Birds, Smart Farming",
    desc: "Modern genetics, day-old chick quality, nutrition, and smart farming practices that deliver healthier flocks and higher productivity for every farm size.",
    highlights: ["Modern breeding", "Healthy flock practices", "Smart farming tech"],
  },
  {
    icon: TrendingUp,
    track: "Focus Area 5",
    title: "Stronger Industry, Stronger Gorakhpur",
    desc: "B2B networking, investor meetups, and partnership building that turn Gorakhpur into the rising poultry hub of Eastern India.",
    highlights: ["B2B networking", "Investor summit", "Partnership & growth"],
  },
]

const focusAreas = [
  "Advancing Poultry Excellence",
  "Driving Innovation & Sustainability",
  "Building Opportunities for Gorakhpur",
  "Better Breeding, Healthy Birds, Smart Farming",
  "Stronger Industry, Stronger Gorakhpur",
]

export default function Agenda() {
  const [active, setActive] = useState(0)
  const ActiveIcon = tracks[active].icon

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-navy-900 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-brand-300/40 to-transparent dark:via-brand-700/40" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400 mb-3">
              Event Highlights
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-800 dark:text-white mb-4">
              Agenda &amp; <span className="text-gradient">Sessions</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
              Five interactive focus areas packed with knowledge, technology, and networking opportunities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5">
              <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-semibold px-4 py-2 rounded-full border border-brand-200 dark:border-brand-800">
                <CalendarCheck className="w-3.5 h-3.5" />
                Sunday, 23 August 2026
              </div>
              <div className="inline-flex items-center gap-2 bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 text-xs font-semibold px-4 py-2 rounded-full border border-accent-200 dark:border-accent-800">
                <MapPin className="w-3.5 h-3.5" />
                Baba Gambhirnath Auditorium, Taramandal, Gorakhpur
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Track Tabs */}
          <ScrollReveal>
            <div className="space-y-3">
              {tracks.map((t, i) => (
                <button
                  key={t.track}
                  onClick={() => setActive(i)}
                  className={`w-full flex items-center gap-4 text-left px-5 py-4 rounded-2xl border transition-all duration-300 ${
                    active === i
                      ? "bg-gradient-to-r from-brand-600 to-accent-600 border-transparent shadow-xl shadow-brand-600/20 scale-[1.02]"
                      : "bg-slate-50 dark:bg-navy-800 border-slate-200 dark:border-navy-700 hover:border-brand-200 dark:hover:border-brand-600"
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    active === i ? "bg-white/20" : "bg-brand-50 dark:bg-brand-900/30"
                  }`}>
                    <t.icon className={`w-5 h-5 ${active === i ? "text-white" : "text-brand-600 dark:text-brand-400"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${active === i ? "text-brand-100" : "text-brand-600 dark:text-brand-400"}`}>{t.track}</p>
                    <h3 className={`text-sm font-bold leading-snug ${active === i ? "text-white" : "text-navy-800 dark:text-white"}`}>{t.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Active Track Detail */}
          <ScrollReveal>
            <div key={active} className="relative rounded-3xl p-8 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-xl animate-fade-in">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500 rounded-t-3xl" />
              <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-accent-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-brand-600/20">
                <ActiveIcon className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400">{tracks[active].track}</span>
              <h3 className="text-xl md:text-2xl font-bold text-navy-800 dark:text-white mt-1 mb-3">{tracks[active].title}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-5">{tracks[active].desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {tracks[active].highlights.map((h) => (
                  <span key={h} className="text-xs font-medium bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-600 rounded-full px-3 py-1.5 text-navy-700 dark:text-slate-200">
                    {h}
                  </span>
                ))}
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-accent-600 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <CalendarCheck className="w-4 h-4" />
                Reserve My Seat
              </Link>
            </div>
            </ScrollReveal>
        </div>

        {/* Theme & Key Focus Areas */}
        <ScrollReveal>
          <div className="mt-14 rounded-3xl bg-gradient-to-br from-navy-800 to-navy-700 dark:from-navy-900 dark:to-navy-800 p-8 md:p-10 border border-brand-200/20 shadow-2xl dark:shadow-black/10">
            <div className="text-center mb-8">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-300 mb-3">
                Theme &amp; Key Focus Areas
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                Theme: <span className="text-gradient">A Vision for a Stronger Tomorrow</span> 🐔
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {focusAreas.map((f, i) => (
                <div key={f} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:border-brand-400/40 transition-all">
                  <span className="text-xl font-extrabold text-gradient block mb-1.5">0{i + 1}</span>
                  <p className="text-xs sm:text-sm font-semibold text-white leading-snug">{f}</p>
                </div>
              ))}
            </div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto text-center">
              From smarter breeding and healthier flocks to modern farming, stronger business networks, and a
              brighter future for Gorakhpur — the entire conclave is built around these five key focus areas.
              Every talk, exhibition, and networking session works toward one goal: a stronger, more
              innovative, and more profitable poultry industry for Eastern Uttar Pradesh.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
