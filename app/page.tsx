import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import SparkleEventBanner from "@/components/SparkleEventBanner"
import Hero from "@/components/Hero"
import Pillars from "@/components/Pillars"
import FocusAreas from "@/components/FocusAreas"
import Attractions from "@/components/Attractions"
import Agenda from "@/components/Agenda"
import Gallery from "@/components/Gallery"
import RegisterCTA from "@/components/RegisterCTA"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <SparkleEventBanner sticky />
      <main id="main-content">
        <Hero />
        <Pillars />
        <Gallery />
        <FocusAreas />
        <Attractions />
        <Agenda />
        <RegisterCTA />
      </main>
      <Footer />
    </>
  )
}
