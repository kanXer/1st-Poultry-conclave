import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Contact from "@/components/Contact"

export const metadata: Metadata = {
  title: "Help & Support — 1st Poultry Conclave Gorakhpur 2026",
  description:
    "Need help with the 1st Poultry Conclave Gorakhpur (Edition 2026)? Get support for registration, venue, exhibition, ID cards, payments and more — Sunday, 23 August 2026 at Baba Gambhirnath Auditorium, Taramandal, Gorakhpur. Call +91 9336212329.",
  keywords: [
    "contact poultry conclave gorakhpur",
    "poultry conclave help",
    "poultry conclave support",
    "poultry conclave registration help gorakhpur",
    "poultry conclave venue information",
  ],
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-16 md:pt-24">
        <Contact />
      </main>
      <Footer />
    </>
  )
}