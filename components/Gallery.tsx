"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, X, Maximize2, ExternalLink, Video as VideoIcon, Images, Camera, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import ScrollReveal from "./ScrollReveal"

interface Item {
  _id: string
  type: "image" | "video"
  url: string
  title?: string
  starred: boolean
}

export default function Gallery() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<{ list: Item[]; idx: number } | null>(null)
  const [videoModal, setVideoModal] = useState<Item | null>(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    fetch("/api/gallery")
      .then(r => r.json())
      .then(d => {
        setItems(d.items || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const photos = items.filter(i => i.type === "image" && i.starred)
  const videos = items.filter(i => i.type === "video" && i.starred)

  const prevLightbox = useCallback(() => {
    if (!lightbox) return
    setLightbox({ ...lightbox, idx: (lightbox.idx - 1 + lightbox.list.length) % lightbox.list.length })
  }, [lightbox])

  const nextLightbox = useCallback(() => {
    if (!lightbox) return
    setLightbox({ ...lightbox, idx: (lightbox.idx + 1) % lightbox.list.length })
  }, [lightbox])

  useEffect(() => {
    if (!lightbox && !videoModal) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setLightbox(null); setVideoModal(null) }
      if (e.key === "ArrowLeft" && lightbox) prevLightbox()
      if (e.key === "ArrowRight" && lightbox) nextLightbox()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightbox, videoModal, prevLightbox, nextLightbox])

  function getYtId(url: string) {
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    return m ? m[1] : null
  }

  if (loading) return (
    <section id="gallery" className="bg-gradient-to-br from-navy-800 to-navy-700 dark:from-navy-900 dark:to-navy-800 py-20 flex items-center justify-center" style={{ minHeight: 400 }}>
      <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </section>
  )

  if (photos.length === 0 && videos.length === 0) return null

  return (
    <section id="gallery" className="py-16 md:py-24 bg-gradient-to-br from-navy-800 to-navy-700 dark:from-navy-900 dark:to-navy-800 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300 mb-3">
              <Camera className="w-3.5 h-3.5" /> Event Gallery
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Moments from the <span className="text-gradient">Conclave</span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              A glimpse of the energy, innovation, and networking that will define Eastern UP&apos;s first poultry conclave.
            </p>
          </div>
        </ScrollReveal>

        {photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((p, i) => (
              <button
                key={p._id}
                onClick={() => setLightbox({ list: photos, idx: i })}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-navy-900 border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400 cursor-pointer"
              >
                <div className="absolute inset-0 bg-cover bg-center blur-lg scale-110 opacity-60 transition-all duration-700 group-hover:opacity-70 group-hover:scale-115"
                  style={{ backgroundImage: `url(${p.url})` }} aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300" />
                <img src={p.url} alt={p.title || `Gallery photo ${i + 1}`} loading="lazy"
                  className="absolute inset-0 w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-white text-xs font-medium truncate">{p.title || `Photo ${i + 1}`}</span>
                  <Maximize2 className="w-3.5 h-3.5 text-white/80 shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}

        {videos.length > 0 && (
          <>
            <ScrollReveal>
              <h3 className="text-xl font-bold text-white mb-6 mt-12 flex items-center justify-center gap-2">
                <VideoIcon className="w-5 h-5 text-brand-400" /> Videos from the Event
              </h3>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(v => {
                const ytId = getYtId(v.url)
                const ytThumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null
                return ytId ? (
                  <button key={v._id} onClick={() => setVideoModal(v)}
                    className="group relative rounded-2xl overflow-hidden bg-black shadow-lg border border-white/10 hover:border-brand-400/40 transition-all cursor-pointer text-left">
                    <div className="aspect-video">
                      <img src={ytThumb!} alt={v.title || ""} loading="lazy"
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                          <Play size={24} className="text-brand-600 ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
                      <span className="text-white text-sm font-medium truncate block">{v.title || "Video"}</span>
                    </div>
                  </button>
                ) : (
                  <a key={v._id} href={v.url} target="_blank" rel="noopener noreferrer"
                    className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-navy-900 border border-white/10 transition-all hover:border-brand-400/40 block">
                    <div className="aspect-video flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all">
                          <Play size={24} className="text-brand-400 ml-0.5" />
                        </div>
                        <p className="text-white font-semibold text-sm">{v.title || "Video"}</p>
                        <div className="flex items-center justify-center gap-1 mt-2 text-white/50 text-xs">
                          <ExternalLink size={12} /> <span>Click to open</span>
                        </div>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          </>
        )}

        <ScrollReveal>
          <div className="mt-12 text-center">
            <Link href="/gallery"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-600 text-white text-sm font-semibold px-6 py-3 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all">
              <Images className="w-4 h-4" /> View Full Gallery
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Photo Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center" onClick={() => setLightbox(null)}>
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />
          <button onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white z-10 hover:bg-white/10 rounded-full transition-all">
            <X size={28} />
          </button>
          <div className="relative z-10 flex items-center justify-center w-full h-full p-4 animate-fade-in">
            {lightbox.list.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevLightbox() }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all z-10">
                  <ChevronLeft size={32} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextLightbox() }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all z-10">
                  <ChevronRight size={32} />
                </button>
              </>
            )}
            <div className="flex flex-col items-center max-w-5xl w-full px-12">
              <img key={lightbox.idx}
                src={lightbox.list[lightbox.idx].url}
                alt={lightbox.list[lightbox.idx].title || ""}
                className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl animate-slide-up"
                onClick={(e) => e.stopPropagation()} />
              {lightbox.list[lightbox.idx].title && (
                <p className="mt-4 text-white/80 text-sm font-medium text-center max-w-lg animate-slide-up">
                  {lightbox.list[lightbox.idx].title}
                </p>
              )}
              <div className="mt-3 flex items-center gap-3 animate-slide-up">
                <div className="bg-white/10 text-white/70 text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {lightbox.idx + 1} / {lightbox.list.length}
                </div>
                <a href={lightbox.list[lightbox.idx].url} target="_blank" rel="noopener noreferrer"
                  className="bg-white/10 text-white/70 text-xs px-3 py-1.5 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all flex items-center gap-1">
                  <ExternalLink size={10} /> Open Original
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center" onClick={() => setVideoModal(null)}>
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />
          <button onClick={() => setVideoModal(null)}
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white z-10 hover:bg-white/10 rounded-full transition-all">
            <X size={28} />
          </button>
          <div className="relative z-10 w-full max-w-4xl mx-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const ytId = getYtId(videoModal.url)
              const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0` : null
              return embedUrl ? (
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                  <iframe src={embedUrl} title={videoModal.title || ""}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen className="w-full h-full" />
                </div>
              ) : (
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
                  <video src={videoModal.url} controls autoPlay className="w-full h-full" />
                </div>
              )
            })()}
            {videoModal.title && (
              <p className="mt-4 text-white/80 text-sm font-medium text-center">{videoModal.title}</p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
