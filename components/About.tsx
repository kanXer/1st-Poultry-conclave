'use client'

import Link from "next/link"
import {
  Award,
  MapPin,
  Phone,
  Rocket,
  Leaf,
  Building2,
  Quote,
  Star,
  Heart,
  ChevronRight,
  CalendarCheck,
} from "lucide-react"
import ScrollReveal from "./ScrollReveal"
import TextReveal from "./TextReveal"

const pillars = [
  {
    icon: Rocket,
    title: "Advancing Poultry Excellence",
    desc: "Modern technology, high standards, and efficiency in poultry production — with a clear path to raising the bar for the entire Eastern UP industry.",
  },
  {
    icon: Leaf,
    title: "Driving Innovation & Sustainability",
    desc: "Eco-friendly practices, smart technology integration, and renewable feed models that secure a profitable and responsible poultry future.",
  },
  {
    icon: Building2,
    title: "Building Opportunities for Gorakhpur",
    desc: "Boosting the local economy, empowering local farmers, and positioning Gorakhpur as the major commercial poultry hub of Eastern India.",
  },
]

export default function About() {
  return (
    <section id="about" className="relative py-16 md:py-24 bg-slate-50 dark:bg-navy-900 overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-brand-300/40 to-transparent dark:via-brand-700/40" />
      <div className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-bl from-brand-100/20 dark:from-brand-900/20 to-accent-100/10 dark:to-accent-900/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-gradient-to-tr from-accent-100/20 dark:from-accent-900/20 to-brand-100/10 dark:to-brand-900/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-navy-800 border border-brand-200 dark:border-navy-700 shadow-sm rounded-full pl-3 pr-4 py-2 mb-4">
              <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                Organizer:{" "}
                <span className="font-bold text-navy-800 dark:text-white">
                  Department of Animal Husbandry &amp; Dairying, Uttar Pradesh Government
                </span>
              </span>
            </div>
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400 mb-3">
              About the Conclave
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold text-navy-800 dark:text-white mb-4">
              <TextReveal tag="div" text="1st Poultry Conclave" delay={200} stagger={45} className="block" />
              <TextReveal tag="div" text="Gorakhpur" delay={500} stagger={40} gradient className="block text-gradient" />
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-lg">
              Innovate • Collaborate • Grow — A New Era for Poultry in Eastern UP! 🐔 Edition 2026 •
              Sunday, 23 August 2026 | Baba Gambhirnath Auditorium, Taramandal, Gorakhpur, Uttar Pradesh, India.
            </p>
          </div>
        </ScrollReveal>

        {/* Event Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start mb-20">
          <ScrollReveal>
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-navy-800 to-navy-700 dark:from-navy-900 dark:to-navy-800 shadow-2xl dark:shadow-2xl dark:shadow-black/20 border-4 border-white dark:border-navy-800 p-8">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500" />
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white p-1.5 border border-brand-200 shadow-lg mb-4">
                  <img src="/logo-transparent.png" alt="1st Poultry Conclave Gorakhpur logo" className="w-full h-full object-contain" width={80} height={80} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-300 mb-1">Edition 2026</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">FIRST POULTRY CONCLAVE</h3>
                <p className="text-brand-200 text-sm mt-1">GORAKHPUR, INDIA</p>
                <div className="mt-4 space-y-2">
                  <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 border border-white/10">
                    <CalendarCheck className="w-3.5 h-3.5 text-brand-400" />
                    <span className="text-xs font-semibold text-white">Sunday, 23 August 2026</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-accent-400" />
                    <span className="text-xs font-semibold text-white">Baba Gambhirnath Auditorium, Taramandal, Gorakhpur</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-brand-300 text-xs font-semibold uppercase tracking-wider">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                Uniting Industry Leaders — Shaping a Progressive Future
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="inline-flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-semibold px-3 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-800">
                  <Award className="w-3 h-3" /> First-Ever Regional Conclave
                </span>
                <span className="inline-flex items-center gap-1 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-200 dark:border-brand-800">
                  <Heart className="w-3 h-3" /> Empowering Local Farmers
                </span>
                <span className="inline-flex items-center gap-1 bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-accent-200 dark:border-accent-800">
                  <MapPin className="w-3 h-3" /> Baba Gambhirnath Auditorium, Taramandal, Gorakhpur
                </span>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-800 dark:text-white">
                Gorakhpur: The Rising <span className="text-gradient">Poultry Hub</span> of Eastern India
              </h3>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                The <strong>1st Poultry Conclave Gorakhpur (Edition 2026)</strong> is a first-of-its-kind industry
                platform in Eastern Uttar Pradesh, created to bring together poultry farmers, enterprise owners,
                feed manufacturers, veterinarians, investors, and government bodies under one roof.
              </p>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Gorakhpur is fast emerging as the commercial poultry hub of Eastern India. This conclave has been
                designed to accelerate that growth — with technical seminars on bird health and bio-security,
                feed technology and smart equipment exhibitions, sessions on government subsidies and bank finance,
                and structured B2B networking.
              </p>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                If you are a farmer looking to modernise, a business seeking market linkages, or an investor exploring
                the region&apos;s potential — this is your opportunity to <strong>learn, connect, and grow</strong>
                with the leaders shaping the future of poultry in Gorakhpur and beyond.
              </p>

              <div className="bg-gradient-to-r from-brand-600/10 via-accent-600/10 to-brand-600/10 rounded-2xl p-6 border border-brand-200 dark:border-brand-800 text-center">
                <h4 className="text-lg font-bold text-navy-800 dark:text-white mb-2">Our Theme</h4>
                <p className="text-2xl md:text-3xl font-extrabold text-gradient mb-2">A Vision for a Stronger Tomorrow 🐔</p>
                <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto">
                  Empowering Gorakhpur through poultry progress — Innovate, Collaborate, Grow.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  {["Better Breeding, Healthy Birds, Smart Farming", "Stronger Industry, Stronger Gorakhpur"].map((f) => (
                    <span key={f} className="text-xs font-semibold bg-white dark:bg-navy-800 border border-brand-200 dark:border-brand-800 rounded-full px-3 py-1.5 text-navy-800 dark:text-white">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-navy-800 rounded-2xl p-5 border border-slate-200 dark:border-navy-700 shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  {[
                    { label: "Agenda Tracks", value: "4" },
                    { label: "Pillars", value: "3" },
                    { label: "Industry Sectors", value: "6+" },
                    { label: "B2B Meetings", value: "Unlimited" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-2xl font-extrabold text-gradient">{s.value}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-center pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-accent-600 dark:from-brand-500 dark:to-accent-500 text-white font-semibold px-6 py-3 rounded-full shadow-xl dark:shadow-black/10 hover:shadow-2xl transition-all hover:scale-105 active:scale-95 text-sm"
                >
                  Register for the Conclave <ChevronRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:+919336212329"
                  className="inline-flex items-center gap-2 bg-slate-200 dark:bg-navy-800 hover:bg-slate-300 dark:hover:bg-navy-700 text-navy-800 dark:text-white font-semibold text-sm px-6 py-3 rounded-full transition-all"
                >
                  <Phone className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Contact Secretariat
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Pillars Detail */}
        <div className="mb-20">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent-600 dark:text-accent-400 mb-3">Our Focus</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy-800 dark:text-white mb-4">
                Why This Conclave <span className="text-gradient">Matters</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">Three core pillars guide everything the conclave delivers to Gorakhpur&apos;s poultry community.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {pillars.map((item) => (
              <ScrollReveal key={item.title}>
                <div className="group relative h-full text-center p-8 bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 hover:border-brand-200 dark:hover:border-brand-600 hover:shadow-xl dark:hover:shadow-xl dark:hover:shadow-black/10 transition-all">
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-brand-600/20">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-800 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal>
          <div className="bg-gradient-to-r from-navy-800 to-navy-700 rounded-3xl p-8 md:p-12 shadow-2xl dark:shadow-2xl dark:shadow-black/10 text-center">
            <Quote className="w-10 h-10 text-brand-400/50 dark:text-brand-300/50 mx-auto mb-4" />
            <blockquote className="text-xl md:text-2xl text-white font-medium italic max-w-4xl mx-auto leading-relaxed">
              &ldquo;Gorakhpur is not just growing — it is leading the poultry revolution of Eastern India.
              Our mission with the 1st Poultry Conclave is to give every farmer, business, and investor the platform
              they deserve to innovate, collaborate, and grow.&rdquo;
            </blockquote>
            <p className="text-brand-300 dark:text-brand-200 mt-4 font-semibold">— 1st Poultry Conclave Secretariat, Gorakhpur</p>
            <div className="mt-6">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-600 text-white font-semibold px-6 py-3 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <CalendarCheck className="w-4 h-4" />
                Register Now
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
