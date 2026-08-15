import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import RegistrationForm from "@/components/RegistrationForm"

export const metadata: Metadata = {
  title: "Register for the Poultry Conclave — 1st Poultry Conclave Gorakhpur 2026",
  description:
    "Register as attendee, exhibitor or sponsor for the 1st Poultry Conclave Gorakhpur (Edition 2026), Sunday 23 August 2026 at Baba Gambhirnath Auditorium, Taramandal, Gorakhpur. Free online registration with name, occupation, phone & email. Captcha protected.",
  keywords: [
    "poultry conclave registration",
    "register poultry conclave gorakhpur",
    "poultry event registration 2026",
    "exhibitor registration poultry gorakhpur",
    "attendee registration poultry conclave",
  ],
}

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-16 md:pt-24">
        <RegistrationForm />
      </main>
      <Footer />
    </>
  )
}
