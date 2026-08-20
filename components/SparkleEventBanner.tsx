import { Sparkle, CalendarCheck, Clock, MapPin, Navigation } from "lucide-react"

const SPARKLES = [
  { top: "14%", left: "4%", size: 13, delay: "0s", duration: "2.4s" },
  { top: "68%", left: "8%", size: 8, delay: "0.7s", duration: "3s" },
  { top: "24%", left: "15%", size: 6, delay: "1.3s", duration: "2.2s" },
  { top: "78%", left: "20%", size: 10, delay: "0.3s", duration: "2.8s" },
  { top: "18%", left: "28%", size: 7, delay: "1.7s", duration: "2.5s" },
  { top: "64%", left: "33%", size: 11, delay: "0.5s", duration: "3.2s" },
  { top: "28%", left: "40%", size: 5, delay: "1s", duration: "2.1s" },
  { top: "74%", left: "48%", size: 9, delay: "1.4s", duration: "2.7s" },
  { top: "16%", left: "57%", size: 6, delay: "0.9s", duration: "2.6s" },
  { top: "82%", left: "63%", size: 12, delay: "0.2s", duration: "3.1s" },
  { top: "26%", left: "71%", size: 7, delay: "1.6s", duration: "2.3s" },
  { top: "70%", left: "78%", size: 5, delay: "0.6s", duration: "2.9s" },
  { top: "12%", left: "85%", size: 10, delay: "1.8s", duration: "2.5s" },
  { top: "56%", left: "92%", size: 7, delay: "0.4s", duration: "2.7s" },
  { top: "40%", left: "96%", size: 5, delay: "1.2s", duration: "3.3s" },
  { top: "52%", left: "1%", size: 5, delay: "0.8s", duration: "2.4s" },
]

export default function SparkleEventBanner({ sticky = true }: { sticky?: boolean }) {
  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Baba Gambhirnath Auditorium, Taramandal, Gorakhpur, Uttar Pradesh, India")

  return (
    <section
      aria-label="Event date, time and venue"
      className={`w-full overflow-hidden bg-navy-950 ${sticky ? "sticky z-40 top-[var(--header-height)]" : ""}`}
    >
      {/* Layered premium background */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(217,169,79,0.12),transparent_55%),radial-gradient(ellipse_at_80%_100%,rgba(242,92,13,0.10),transparent_55%)]" />

      {/* Gold hairline borders */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

      {/* Animated glow blobs */}
      <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-brand-400/15 blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-12 -right-10 w-52 h-52 rounded-full bg-accent-500/15 blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-brand-300/10 blur-3xl animate-pulse-slow" />

      {/* Sweeping golden shine */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-banner-shine absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-brand-200/10 to-transparent" />
      </div>

      {/* Twinkling gold sparkles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {SPARKLES.map((s, i) => (
          <Sparkle
            key={i}
            size={s.size}
            className="sparkle-star absolute text-brand-300"
            style={{
              top: s.top,
              left: s.left,
              animationDelay: s.delay,
              animationDuration: s.duration,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-center gap-2.5 sm:gap-3 lg:gap-7 animate-slide-up">
          {/* Title */}
          <div className="flex items-center justify-center gap-2.5 lg:shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-300 via-brand-400 to-accent-500 p-[1.5px] shadow-[0_0_18px_rgba(217,169,79,0.45)]">
              <div className="w-full h-full rounded-[10px] bg-navy-950 flex items-center justify-center overflow-hidden">
                <Sparkle size={14} className="text-brand-300 animate-spin-slow" />
              </div>
            </div>
            <p className="text-gradient-gold text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.24em] whitespace-nowrap">
              Poultry Conclave <span className="text-white/50 font-semibold tracking-[0.18em]">•</span> 2026
            </p>
          </div>

          <div className="hidden lg:block h-8 w-px bg-gradient-to-b from-transparent via-brand-300/40 to-transparent" />

          {/* Detail pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {/* Date */}
            <div className="glass-pill">
              <div className="icon-medallion bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500">
                <CalendarCheck className="w-3 h-3 text-navy-950" strokeWidth={2.6} />
              </div>
              <span className="banner-value">Sunday, 23 Aug 2026</span>
            </div>

            {/* Time */}
            <div className="glass-pill">
              <div className="icon-medallion bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500">
                <Clock className="w-3 h-3 text-navy-950" strokeWidth={2.6} />
              </div>
              <span className="banner-value">9:00 AM – 4:00 PM</span>
            </div>

            {/* Venue — opens Google Maps */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="venue-pill group"
              title="Open on Google Maps"
            >
              <div className="icon-medallion bg-gradient-to-br from-accent-400 via-accent-500 to-accent-600">
                <MapPin className="w-3 h-3 text-white" strokeWidth={2.6} />
              </div>
              <span className="banner-value group-hover:text-brand-100 transition-colors">
                Baba Gambhirnath Auditorium, Taramandal, Gorakhpur
              </span>
              <Navigation className="w-3 h-3 text-brand-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-400/25 to-accent-500/25 border border-brand-300/30 text-[9px] font-bold tracking-wider uppercase text-brand-200 group-hover:bg-brand-400/40 transition-colors whitespace-nowrap">
                Directions
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}