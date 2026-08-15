import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import About from "@/components/About"

export const metadata: Metadata = {
  title: "About — 1st Poultry Conclave Gorakhpur 2026",
  description:
    "Learn about the 1st Poultry Conclave Gorakhpur (Edition 2026) — Innovate, Collaborate, Grow on Sunday, 23 August 2026 at Baba Gambhirnath Auditorium, Taramandal, Gorakhpur. A platform for poultry farmers, enterprises, feed manufacturers and investors in Eastern UP.",
  keywords: [
    "poultry conclave gorakhpur about",
    "1st poultry conclave gorakhpur",
    "poultry hub eastern india",
    "poultry event eastern up",
    "poultry industry uttar pradesh",
    "b2b poultry networking gorakhpur",
  ],
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-16 md:pt-24">
        <About />
      </main>
      <Footer />
    </>
  )
}