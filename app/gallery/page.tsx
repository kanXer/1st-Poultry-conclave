"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { X, ChevronLeft, ChevronRight, Loader2, Image as ImageIcon, Video, Play, Maximize2, ExternalLink } from "lucide-react"

interface Item {
  _id: string
  type: "image" | "video"
  url: string
  title?: string
}

const PHOTOS_PER_PAGE = 30
const VIDEOS_PER_PAGE = 6

export default function GalleryPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"photos" | "videos">("photos")
  const [photoPage, setPhotoPage] = useState(1)
  const [videoPage, setVideoPage] = useState(1)
  const [lightbox, setLightbox] = useState<{ list: Item[]; idx: number } | null>(null)
  const [videoModal, setVideoModal] = useState<Item | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    fetch("/api/gallery")
      .then(r => r.json())
      .then(d => { setItems(d.items || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const photos = items.filter(i => i.type === "image")
  const videos = items.filter(i => i.type === "video")
  const visiblePhotos = photos.slice(0, photoPage * PHOTOS_PER_PAGE)
  const visibleVideos = videos.slice(0, videoPage * VIDEOS_PER_PAGE)

  function openLightbox(list: Item[], idx: number) { setLightbox({ list, idx }) }

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

  function getYt(u: string) {
    if (!u) return null
    const m = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    return m?.[1] || null
  }

  function handleImgLoad(id: string) {
    setLoadedImages(prev => new Set(prev).add(id))
  }

  return (
    <>
      <Header />
      <section className="min-h-screen bg-white dark:bg-navy-900">
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle at 25px 25px, #0ea5e9 1px, transparent 0)", backgroundSize: "50px 50px" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Our Gallery
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-navy-800 dark:text-white mb-4 tracking-tight">
              Moments of the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600">Conclave</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
              Photos and videos from the 1st Poultry Conclave Gorakhpur 2026 — capturing the energy, innovation, and powerful connections that make the day special.
            </p>
          </div>

          <div className="flex justify-center gap-3 mb-10">
            <button onClick={() => { setTab("photos"); setPhotoPage(1) }}
              className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                tab === "photos"
                  ? "bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-lg shadow-brand-600/20 scale-105"
                  : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-navy-700 hover:scale-105"
              }`}>
              <ImageIcon size={16} /> Photos
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${tab === "photos" ? "bg-white/20" : "bg-slate-200 dark:bg-navy-700"}`}>
                {photos.length}
              </span>
            </button>
            <button onClick={() => { setTab("videos"); setVideoPage(1) }}
              className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                tab === "videos"
                  ? "bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-lg shadow-brand-600/20 scale-105"
                  : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-navy-700 hover:scale-105"
              }`}>
              <Video size={16} /> Videos
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${tab === "videos" ? "bg-white/20" : "bg-slate-200 dark:bg-navy-700"}`}>
                {videos.length}
              </span>
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-slate-100 dark:bg-navy-800 animate-pulse" />
              ))}
            </div>
          ) : tab === "photos" ? (
            photos.length === 0 ? (
              <div className="text-center py-24 animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 dark:bg-navy-800 flex items-center justify-center">
                  <ImageIcon size={36} className="text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-slate-400 dark:text-slate-500 text-lg font-medium">No photos yet</p>
                <p className="text-slate-300 dark:text-slate-600 text-sm mt-1">Check back soon for updates.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {visiblePhotos.map((p) => (
                    <div key={p._id}
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-navy-800 shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer border border-slate-100 dark:border-navy-700 animate-fade-in"
                      onClick={() => openLightbox(photos, photos.indexOf(p))}>
                      <div className="absolute inset-0 bg-cover bg-center blur-lg scale-110 opacity-60 transition-all duration-700 group-hover:opacity-70 group-hover:scale-115"
                        style={{ backgroundImage: `url(${p.url})` }} aria-hidden="true" />
                      {!loadedImages.has(p._id) && (
                        <div className="absolute inset-0 bg-slate-200 dark:bg-navy-700 animate-pulse" />
                      )}
                      <img src={p.url} alt={p.title || `Gallery photo`}
                        className={`absolute inset-0 w-full h-full object-contain p-2 transition-all duration-700 group-hover:scale-105 ${
                          loadedImages.has(p._id) ? "opacity-100" : "opacity-0"
                        }`}
                        loading="lazy"
                        onLoad={() => handleImgLoad(p._id)} />
                      <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 flex items-center justify-between gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-white text-xs font-medium truncate drop-shadow">{p.title || "Photo"}</span>
                        <Maximize2 className="w-3.5 h-3.5 text-white/80 shrink-0 drop-shadow" />
                      </div>
                    </div>
                  ))}
                </div>
                {photos.length > visiblePhotos.length && (
                  <div className="flex justify-center mt-12">
                    <button onClick={() => setPhotoPage(p => p + 1)}
                      className="group relative px-10 py-3.5 rounded-full font-semibold text-sm overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95">
                      <span className="absolute inset-0 bg-gradient-to-r from-brand-600 to-accent-600" />
                      <span className="absolute inset-0 bg-gradient-to-r from-brand-700 to-accent-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative text-white flex items-center gap-2">
                        Load More
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                          {photos.length - visiblePhotos.length}
                        </span>
                      </span>
                    </button>
                  </div>
                )}
              </>
            )
          ) : videos.length === 0 ? (
            <div className="text-center py-24 animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 dark:bg-navy-800 flex items-center justify-center">
                <Video size={36} className="text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-slate-400 dark:text-slate-500 text-lg font-medium">No videos yet</p>
              <p className="text-slate-300 dark:text-slate-600 text-sm mt-1">Check back soon for updates.</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleVideos.map((v) => {
                  const yt = getYt(v.url)
                  const ytThumb = yt ? `https://img.youtube.com/vi/${yt}/hqdefault.jpg` : null
                  return yt ? (
                    <div key={v._id}
                      className="group relative rounded-2xl overflow-hidden bg-black shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer animate-fade-in"
                      onClick={() => setVideoModal(v)}>
                      <div className="aspect-video">
                        <img src={ytThumb!} alt={v.title || ""}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                          loading="lazy" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                            <Play size={28} className="text-brand-600 ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-8">
                        <p className="text-white text-sm font-medium">{v.title || "YouTube Video"}</p>
                      </div>
                    </div>
                  ) : v.url ? (
                    <a key={v._id} href={v.url} target="_blank" rel="noopener noreferrer"
                      className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-navy-900 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] block animate-fade-in">
                      <div className="aspect-video flex items-center justify-center">
                        <div className="text-center p-6">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all group-hover:scale-110">
                            <Video size={28} className="text-red-400 ml-0.5" />
                          </div>
                          <p className="text-white font-semibold">{v.title || "Video"}</p>
                          <div className="flex items-center justify-center gap-1 mt-2 text-white/50 text-xs">
                            <ExternalLink size={12} /> <span>Click to open</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ) : null
                })}
              </div>
              {videos.length > visibleVideos.length && (
                <div className="flex justify-center mt-10">
                  <button onClick={() => setVideoPage(p => p + 1)}
                    className="group relative px-8 py-3 rounded-full font-semibold text-sm overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95">
                    <span className="absolute inset-0 bg-gradient-to-r from-brand-600 to-accent-600" />
                    <span className="absolute inset-0 bg-gradient-to-r from-brand-700 to-accent-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative text-white flex items-center gap-2">
                      Load More
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                        {videos.length - visibleVideos.length}
                      </span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

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
              const yt = getYt(videoModal.url)
              const embedUrl = yt ? `https://www.youtube.com/embed/${yt}?autoplay=1&rel=0` : null
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

      <Footer />
    </>
  )
}
