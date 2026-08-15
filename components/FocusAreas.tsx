'use client'

import { Dna, ShieldPlus, Cog, BarChart3 } from "lucide-react"
import ScrollReveal from "./ScrollReveal"

const focusAreas = [
  {
    icon: Dna,
    title: "Better Breeding, Better Tomorrow",
    desc: "Focus on genetic purity, high-yield breeding, and resilience. Learn modern breeding practices that build stronger flocks for the future.",
  },
  {
    icon: ShieldPlus,
    title: "Healthy Birds, Healthy Nation",
    desc: "Bio-security, vaccination protocols, and disease prevention strategies. Protect your flock and your livelihood with expert-led guidance.",
  },
  {
    icon: Cog,
    title: "Smart Farming, Sustainable Future",
    desc: "Automation, climate-controlled sheds, IoT sensors, and efficient feed management. Run smarter operations with less waste and higher returns.",
  },
  {
    icon: BarChart3,
    title: "Stronger Industry, Stronger Gorakhpur",
    desc: "Market linkages, financial opportunities, and employment generation in Eastern UP. Grow your business while growing the regional economy.",
  },
]

export default function FocusAreas() {
  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-navy-900 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent-300/40 to-transparent dark:via-accent-700/40" />
      <div className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-bl from-brand-100/20 dark:from-brand-900/20 to-accent-100/10 dark:to-accent-900/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-gradient-to-tr from-accent-100/20 dark:from-accent-900/20 to-brand-100/10 dark:to-brand-900/10 rounded-full blur-3xl -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent-600 dark:text-accent-400 mb-3">
              Core Focus Areas
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-800 dark:text-white mb-4">
              What the <span className="text-gradient">Conclave</span> Delivers
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
              Four focused tracks covering the complete poultry value chain — from breeding to market.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {focusAreas.map((area, i) => (
            <ScrollReveal key={area.title}>
              <div className="group relative h-full text-center p-7 bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 hover:border-accent-200 dark:hover:border-accent-600 hover:shadow-xl dark:hover:shadow-xl dark:hover:shadow-black/10 transition-all hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-b from-accent-50/50 dark:from-accent-900/30 via-transparent to-brand-50/30 dark:to-brand-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                <div className="w-14 h-14 bg-gradient-to-br from-accent-50 dark:from-accent-900/30 to-brand-50 dark:to-brand-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all border border-accent-100 dark:border-accent-800">
                  <area.icon className="w-7 h-7 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="text-base font-bold text-navy-800 dark:text-white mb-2">{area.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{area.desc}</p>
                <div className="mt-4 flex justify-center gap-1">
                  {Array.from({ length: 4 }).map((_, dot) => (
                    <span key={dot} className={`w-1.5 h-1.5 rounded-full ${dot === i % 4 ? "bg-accent-500" : "bg-slate-200 dark:bg-navy-700"}`} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
