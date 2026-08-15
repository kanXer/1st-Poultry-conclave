"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { GripVertical, Trash2, Star, Film, Loader, ArrowLeft, ChevronUp, ChevronDown, Move, X, Eye } from "lucide-react"
import { useToast } from "@/components/ToastProvider"

interface GalleryItem {
  _id: string
  type: "image" | "video"
  url: string
  title?: string
  order: number
  starred: boolean
  source?: string
}

function getYtId(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  return m ? m[1] : null
}

function GalleryList({
  list,
  label,
  onMove,
  onToggleStar,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  onPreview,
  dragItemRef,
  dragOverRef,
}: {
  list: GalleryItem[]
  label: string
  onMove: (list: GalleryItem[], from: number, to: number) => void
  onToggleStar: (id: string, starred: boolean) => void
  onDelete: (id: string) => void
  onDragStart: (i: number) => void
  onDragOver: (i: number) => void
  onDragEnd: (list: GalleryItem[]) => void
  onPreview: (item: GalleryItem) => void
  dragItemRef: React.MutableRefObject<number | null>
  dragOverRef: React.MutableRefObject<number | null>
}) {
  const [fromInput, setFromInput] = useState("")
  const [toInput, setToInput] = useState("")

  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-xl overflow-hidden mb-6">
      <div className="px-5 py-3 border-b border-slate-100 dark:border-navy-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-navy-800 dark:text-white text-sm">{label} ({list.length})</h3>
          {list.length > 1 && <span className="text-xs text-slate-400">Drag or use arrows</span>}
        </div>
        {list.length > 1 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-400">Move #</span>
            <input type="number" min={1} max={list.length} value={fromInput}
              onChange={e => setFromInput(e.target.value)}
              className="w-14 px-2 py-1 rounded-lg border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-800 dark:text-white text-xs text-center focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <span className="text-xs text-slate-400">to #</span>
            <input type="number" min={1} max={list.length} value={toInput}
              onChange={e => setToInput(e.target.value)}
              className="w-14 px-2 py-1 rounded-lg border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-800 dark:text-white text-xs text-center focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <button type="button" onClick={() => {
              const from = parseInt(fromInput) - 1
              const to = parseInt(toInput) - 1
              if (isNaN(from) || isNaN(to) || from < 0 || from >= list.length || to < 0 || to >= list.length) return
              onMove(list, from, to)
              setFromInput(""); setToInput("")
            }}
              className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium transition-colors">
              <Move className="w-3 h-3 inline mr-1" />Move
            </button>
          </div>
        )}
      </div>
      <div className="divide-y divide-slate-100 dark:divide-navy-700 max-h-[300px] sm:max-h-80 overflow-y-auto">
        {list.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No {label.toLowerCase()} yet.</p>
        ) : list.map((item, idx) => {
          const ytId = item.type === "video" ? getYtId(item.url) : null
          return (
            <div key={item._id}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={(e) => { e.preventDefault(); onDragOver(idx) }}
              onDragEnd={() => onDragEnd(list)}
              className="flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-navy-750 transition-colors cursor-grab active:cursor-grabbing group"
            >
              <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
              <span className="text-xs text-slate-400 w-5 text-right shrink-0">{idx + 1}</span>
              <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-navy-900 shrink-0 cursor-pointer ring-1 ring-slate-200 dark:ring-navy-700 hover:ring-2 hover:ring-brand-400 transition-all group/th" onClick={() => onPreview(item)}>
                {item.type === "image" ? (
                  <img src={item.url} alt="" loading="lazy" className="w-full h-full object-cover" />
                ) : ytId ? (
                  <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt="" loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Film className="w-4 h-4 text-red-500" /></div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover/th:bg-black/30 flex items-center justify-center transition-all rounded-lg">
                  <Eye className="w-5 h-5 text-white opacity-0 group-hover/th:opacity-100 transition-opacity drop-shadow-lg" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-0.5 shrink-0">
                <button type="button" onClick={() => onMove(list, idx, idx - 1)}
                  disabled={idx === 0}
                  className="p-0.5 rounded text-slate-400 hover:text-navy-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button type="button" onClick={() => onMove(list, idx, idx + 1)}
                  disabled={idx === list.length - 1}
                  className="p-0.5 rounded text-slate-400 hover:text-navy-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <span className="flex-1 text-xs text-navy-800 dark:text-slate-200 truncate min-w-0">{item.title || (item.type === "image" ? "Photo" : "Video")}</span>
              <button type="button" onClick={() => onToggleStar(item._id, item.starred)}
                className={`p-1 rounded-lg transition-all ${
                  item.starred ? "text-yellow-500 hover:text-yellow-600" : "text-slate-300 dark:text-slate-600 hover:text-yellow-500"
                }`}>
                <Star size={14} className={item.starred ? "fill-yellow-500" : ""} />
              </button>
              <button type="button" onClick={() => onDelete(item._id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 transition-all">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState<GalleryItem | null>(null)
  const dragItemRef = useRef<number | null>(null)
  const dragOverRef = useRef<number | null>(null)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) router.push("/admin/login")
  }, [user, authLoading, router])

  function fetchItems() {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => { if (data.items) setItems(data.items.filter((i: GalleryItem) => i.source !== "blog")) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { if (user) fetchItems() }, [user])

  const photos = items.filter(i => i.type === "image")
  const videos = items.filter(i => i.type === "video")

  async function toggleStar(id: string, starred: boolean) {
    await fetch("/api/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ _id: id, starred: !starred }] }),
    })
    toast(starred ? "Unstarred" : "Starred")
    fetchItems()
  }

  async function deleteItem(id: string) {
    if (!confirm("Remove this item?")) return
    await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    toast("Deleted")
    fetchItems()
  }

  async function moveItem(list: GalleryItem[], from: number, to: number) {
    if (from === to || to < 0 || to >= list.length) return
    const reordered = reorderList(list, from, to)
    const setter = list === photos
      ? (arr: GalleryItem[]) => setItems(prev => [...arr, ...prev.filter(i => i.type === "video")])
      : (arr: GalleryItem[]) => setItems(prev => [...prev.filter(i => i.type === "image"), ...arr])
    setter(reordered)
    await fetch("/api/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: reordered.map(i => ({ _id: i._id, order: i.order })) }),
    })
    toast("Reordered")
  }

  function reorderList(list: GalleryItem[], from: number, to: number): GalleryItem[] {
    const updated = [...list]
    const [moved] = updated.splice(from, 1)
    updated.splice(to, 0, moved)
    return updated.map((item, idx) => ({ ...item, order: idx }))
  }

  function handleDragStart(i: number) { dragItemRef.current = i }
  function handleDragOver(i: number) { dragOverRef.current = i }

  function handleDragEnd(list: GalleryItem[]) {
    const from = dragItemRef.current
    const to = dragOverRef.current
    if (from === null || to === null || from === to) {
      dragItemRef.current = null; dragOverRef.current = null; return
    }
    const reordered = reorderList(list, from, to)
    const setter = list === photos
      ? (arr: GalleryItem[]) => setItems(prev => [...arr, ...prev.filter(i => i.type === "video")])
      : (arr: GalleryItem[]) => setItems(prev => [...prev.filter(i => i.type === "image"), ...arr])
    setter(reordered)
    fetch("/api/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: reordered.map(i => ({ _id: i._id, order: i.order })) }),
    })
    dragItemRef.current = null; dragOverRef.current = null
  }

  if (authLoading) return <div className="min-h-screen bg-slate-50 dark:bg-navy-900 flex items-center justify-center"><Loader className="w-8 h-8 animate-spin text-brand-600" /></div>
  if (!user || !user.isAdmin) return null

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-950 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-navy-800 dark:text-white mb-6">Gallery Manager</h1>

        {loading ? (
          <div className="flex justify-center py-20"><Loader className="w-8 h-8 animate-spin text-brand-600" /></div>
        ) : (
          <>
            <GalleryList list={photos} label="Photos"
              onMove={moveItem}
              onToggleStar={toggleStar}
              onDelete={deleteItem}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onPreview={setPreview}
              dragItemRef={dragItemRef}
              dragOverRef={dragOverRef} />
            <GalleryList list={videos} label="Videos"
              onMove={moveItem}
              onToggleStar={toggleStar}
              onDelete={deleteItem}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onPreview={setPreview}
              dragItemRef={dragItemRef}
              dragOverRef={dragOverRef} />
          </>
        )}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setPreview(null)}>
          <div className="relative max-w-3xl w-full max-h-[90vh] bg-white dark:bg-navy-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-navy-700" onClick={e => e.stopPropagation()}>
            <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
              {preview.title && <span className="text-xs font-medium bg-white/90 dark:bg-navy-900/90 text-navy-800 dark:text-white px-3 py-1.5 rounded-lg shadow">{preview.title}</span>}
              <button onClick={() => setPreview(null)}
                className="p-2 rounded-xl bg-white/90 dark:bg-navy-900/90 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-navy-900 transition-all shadow">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-center p-2 bg-black/5 dark:bg-black/20 max-h-[85vh]">
              {preview.type === "image" ? (
                <img src={preview.url} alt={preview.title || ""} className="max-w-full max-h-[85vh] object-contain rounded-xl" />
              ) : (
                <div className="w-full aspect-video max-h-[85vh]">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYtId(preview.url)}?autoplay=1`}
                    className="w-full h-full rounded-xl"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={preview.title || "Video"}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
