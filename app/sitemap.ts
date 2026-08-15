import type { MetadataRoute } from "next"

const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://poultryconclave.in").replace(/\/+$/, "")

// Event fixed date so crawlers see a stable lastModified
const EVENT_DATE = "2026-08-23"

const staticPages: MetadataRoute.Sitemap = [
  {
    url: base,
    lastModified: EVENT_DATE,
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${base}/register`,
    lastModified: EVENT_DATE,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${base}/about`,
    lastModified: EVENT_DATE,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${base}/contact`,
    lastModified: EVENT_DATE,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${base}/gallery`,
    lastModified: EVENT_DATE,
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${base}/feedback`,
    lastModified: EVENT_DATE,
    changeFrequency: "monthly",
    priority: 0.6,
  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return staticPages
}
