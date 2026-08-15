'use client'

import { TreePine, PawPrint, Ship } from "lucide-react"
import ScrollReveal from "./ScrollReveal"

const attractions = [
  {
    icon: PawPrint,
    title: "Gorakhpur Zoo",
    sub: "Shaheed Ashfaq Ullah Khan Prani Udyan",
    desc: "Highlighting wildlife conservation and a modern facility setup — a perfect delegate excursion.",
  },
  {
    icon: TreePine,
    title: "Eco Park, Gorakhpur",
    sub: "Scenic Green Spaces",
    desc: "Scenic green spaces promoting eco-friendly regional expansion and a relaxing break between sessions.",
  },
  {
    icon: Ship,
    title: "Nauka Vihar (Ramgarh Taal)",
    sub: "World-class Lakefront",
    desc: "World-class lakefront, watersports, and the ideal venue for a delegate evening reception.",
  },
]

export default function Attractions() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-navy-800 to-navy-700 dark:from-navy-900 dark:to-navy-800 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-300 mb-3">
              Host City Highlights
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Gorakhpur: The Rising <span className="text-gradient">Poultry Hub</span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              Explore Gorakhpur&apos;s key landmarks and eco-tourism setup while attending the conclave.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {attractions.map((a) => (
            <ScrollReveal key={a.title}>
              <div className="group h-full rounded-2xl p-7 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-400/40 backdrop-blur-sm transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-accent-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-brand-600/20">
                  <a.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-0.5">{a.title}</h3>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-300 mb-3">{a.sub}</p>
                <p className="text-sm text-slate-300 leading-relaxed">{a.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mt-12 text-center">
            <p className="inline-flex items-center gap-2 text-sm text-slate-300 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Gorakhpur, Uttar Pradesh, India — Eastern India&apos;s emerging poultry commerce capital.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}