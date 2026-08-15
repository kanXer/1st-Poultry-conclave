import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import ThemeProvider from "@/components/ThemeProvider"
import { AuthProvider } from "@/components/AuthProvider"
import LoadingBar from "@/components/LoadingBar"
import BackToTop from "@/components/BackToTop"
import ScrollToTop from "@/components/ScrollToTop"
import KeyboardScroll from "@/components/KeyboardScroll"
import { ToastProvider } from "@/components/ToastProvider"
import { Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://poultryconclave.in").replace(/\/+$/, "")
const siteName = "1st Poultry Conclave Gorakhpur"
const tagline = "Innovate • Collaborate • Grow"
const phone = "+919336212329"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `1st Poultry Conclave Gorakhpur 2026 | The Mega Poultry Event of Eastern UP`,
    template: `%s | ${siteName}`,
  },
  description:
    `Poultry's biggest day in Eastern UP — 23 Aug 2026, Baba Gambhirnath Auditorium, Gorakhpur. Expert seminars, smart-equipment expo, B2B & investor summit. Free entry. Contact: ${phone}.`,
  keywords: [
    "1st poultry conclave gorakhpur",
    "poultry conclave gorakhpur 2026",
    "poultry conference gorakhpur",
    "poultry exhibition gorakhpur",
    "poultry event eastern up",
    "poultry farming summit gorakhpur",
    "poultry industry uttar pradesh",
    "gorakhpur poultry hub",
    "poultry seminar gorakhpur",
    "feed technology exhibition gorakhpur",
    "baba gambhirnath auditorium poultry event",
    "taramandal gorakhpur event",
    "poultry conclave 23 august 2026",
    "poultry equipment exhibition",
    "bird health bio security seminar",
    "poultry b2b networking",
    "poultry investor summit gorakhpur",
    "best poultry event in up",
    "poultry conclave registration",
    "gorakhpur rising poultry hub eastern india",
    "nauka vihar gorakhpur",
    "ramgarh taal poultry conclave",
    "eco park gorakhpur event",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: "./" },
  openGraph: {
    title: `1st Poultry Conclave Gorakhpur 2026 | The Mega Poultry Event of Eastern UP`,
    description:
      `Eastern UP's entire poultry industry, one auditorium. Seminars on bird health & biosecurity, feed & smart-equipment expo, government subsidies & bank finance, B2B networking & investor summit — free entry. Sunday, 23 Aug 2026, Gorakhpur.`,
    type: "website",
    locale: "en_IN",
    siteName,
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${siteName} - The Mega Poultry Event of Eastern UP`,
      },
    ],
  },
  icons: {
    icon: "/logo-transparent.png",
    shortcut: "/logo-transparent.png",
    apple: "/logo-transparent.png",
  },
  twitter: {
    card: "summary_large_image",
    title: `1st Poultry Conclave Gorakhpur 2026 | The Mega Poultry Event of Eastern UP`,
    description:
      `The mega poultry event of Eastern UP — 23 Aug 2026, Gorakhpur. Seminars, smart-equipment expo, B2B networking & investor summit. Free entry.`,
    images: [`${siteUrl}/og-image.jpg`],
  },
}

const eventSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BusinessEvent",
      "@id": `${siteUrl}/#event`,
      name: "1st Poultry Conclave Gorakhpur (Edition 2026)",
      description:
        "A premier poultry industry conclave in Gorakhpur, Uttar Pradesh — advancing poultry excellence, driving innovation & sustainability, and building opportunities for Gorakhpur as the rising poultry hub of Eastern India. Tracks: Technical Seminars on Bird Health & Bio-Security; Feed Technology & Smart Poultry Equipment Exhibition; Government Subsidies, Bank Finance & Investment Opportunities; B2B Networking & Investor Summit.",
      url: siteUrl,
      startDate: "2026-08-27",
      endDate: "2026-08-27",
      location: {
        "@type": "Place",
        name: "Baba Gambhirnath Auditorium, Taramandal",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Baba Gambhirnath Auditorium, Taramandal",
          addressLocality: "Gorakhpur",
          addressRegion: "Uttar Pradesh",
          postalCode: "273001",
          addressCountry: "IN",
        },
      },
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      organizer: {
        "@type": "Organization",
        name: "1st Poultry Conclave Secretariat, Gorakhpur",
        url: siteUrl,
      },
      offers: {
        "@type": "Offer",
        name: "Attendee / Exhibitor / Sponsor Registration",
        url: `${siteUrl}/register`,
        price: "0",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
      image: `${siteUrl}/og-image.jpg`,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: `1st Poultry Conclave Gorakhpur 2026 — ${tagline}. Empowering Gorakhpur through poultry progress.`,
      publisher: { "@type": "Organization", name: siteName },
      inLanguage: "en-IN",
    },
  ],
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
        />
        {/* Preload OG image for faster sharing preview */}
        <link rel="preload" as="image" href="/og-image.jpg" />
        {/* Preload logo */}
        <link rel="preload" as="image" href="/logo-transparent.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var m=document.querySelector('meta[name="viewport"]');
              if(!m){m=document.createElement('meta');m.name='viewport';document.head.appendChild(m);}
              m.setAttribute('content','width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
              var force=function(el){el.style.setProperty('font-size','16px','important');};
              var isF=function(t){return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT');};
              document.addEventListener('pointerdown',function(e){if(isF(e.target))force(e.target);},true);
              document.addEventListener('touchstart',function(e){if(isF(e.target))force(e.target);},true);
              document.addEventListener('focusin',function(e){var t=e.target; if(isF(t))force(t);},true);
            }catch(err){}})();`,
          }}
        />
      </head>
      <body className={`${poppins.className} ${poppins.variable} antialiased bg-white dark:bg-navy-900 text-navy-800 dark:text-slate-100 transition-colors duration-300`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-600 focus:text-white focus:rounded-lg focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ScrollToTop />
        <LoadingBar />
        <BackToTop />
        <KeyboardScroll />
        <Analytics />
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
