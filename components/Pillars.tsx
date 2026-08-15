'use client'

import { Rocket, Leaf, Building2 } from "lucide-react"
import ScrollReveal from "./ScrollReveal"

const pillars = [
  {
    icon: Rocket,
    title: "Advancing Poultry Excellence",
    desc: "Focus on modern technology, high standards, and efficiency in poultry production. Learn from leading experts and adopt practices that raise the quality bar across the region.",
  },
  {
    icon: Leaf,
    title: "Driving Innovation & Sustainability",
    desc: "Eco-friendly practices, smart technology integration, and renewable feed models. Discover how sustainable farming secures a profitable and responsible future for poultry.",
  },
  {
    icon: Building2,
    title: "Building Opportunities for Gorakhpur",
    desc: "Boosting the local economy, empowering local farmers, and positioning Gorakhpur as a major regional commercial hub for the poultry industry across Eastern UP.",
  },
]

const focusAreas = [
  "Advancing Poultry Excellence",
  "Driving Innovation & Sustainability",
  "Building Opportunities for Gorakhpur",
  "Better Breeding, Healthy Birds, Smart Farming",
  "Stronger Industry, Stronger Gorakhpur",
]

export default function Pillars() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-navy-900 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-brand-300/40 to-transparent dark:via-brand-700/40" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400 mb-3">
              Key Objectives
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-800 dark:text-white mb-4">
              Vision <span className="text-gradient">Pillars</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
              Theme: A Vision for a Stronger Tomorrow — A New Era for Poultry in Eastern UP! 🐔
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((p, i) => (
            <ScrollReveal key={p.title}>
              <div className="group relative h-full text-center p-8 bg-slate-50 dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 hover:border-brand-200 dark:hover:border-brand-600 hover:shadow-xl dark:hover:shadow-xl dark:hover:shadow-black/10 transition-all hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 dark:from-brand-900/30 via-transparent to-accent-50/30 dark:to-accent-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-brand-600/20">
                  <p.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">0{i + 1}</span>
                <h3 className="text-lg font-bold text-navy-800 dark:text-white mb-2">{p.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{p.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mt-12 text-center bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-lg dark:shadow-black/10 p-8 md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400 mb-5">Key Focus Areas</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {focusAreas.map((f, i) => (
                <span key={f} className="inline-flex items-center gap-2 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-full pl-1.5 pr-4 py-1.5 text-xs sm:text-sm font-semibold text-navy-800 dark:text-white">
                  <span className="w-5 h-5 bg-gradient-to-br from-brand-500 to-accent-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {i + 1}
                  </span>
                  {f}
                </span>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-6 leading-relaxed">
              From better breeding and healthier flocks to smart farming, stronger industry linkages, and a
              stronger Gorakhpur — every session is designed around these five key focus areas, all working
              toward a single theme: <strong className="text-navy-800 dark:text-white">A Vision for a Stronger Tomorrow</strong>. 🐔
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
