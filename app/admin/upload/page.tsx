"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Loader, Image as ImageIcon, Upload, Plus } from "lucide-react"
import { FaYoutube } from "react-icons/fa"
import { useToast } from "@/components/ToastProvider"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SITE_NAME } from "@/lib/site"

export default function UploadPage() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(0)
  const [imageTitle, setImageTitle] = useState("")
  const [ytUrl, setYtUrl] = useState("")
  const [ytTitle, setYtTitle] = useState("")
  const [addingVideo, setAddingVideo] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) router.push("/admin/login")
  }, [user, authLoading, router])

  async function uploadOne(file: File, t: string): Promise<boolean> {
    if (!file.type.startsWith("image/")) return false

    const sigRes = await fetch("/api/upload")
    const sig = await sigRes.json()
    if (!sig.signature) return false

    const fd = new FormData()
    fd.append("file", file)
    fd.append("api_key", sig.api_key)
    fd.append("timestamp", String(sig.timestamp))
    fd.append("signature", sig.signature)
    fd.append("folder", sig.folder)

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloud_name}/auto/upload`,
      { method: "POST", body: fd }
    )
    const uploadData = await uploadRes.json()
    if (!uploadData.secure_url) return false

    const galleryRes = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "image", url: uploadData.secure_url, title: t }),
    })
    const galleryData = await galleryRes.json()
    return !!galleryData.item
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!files || files.length === 0) return

    setUploadError("")
    const imageFiles = Array.from(files).filter(f => f.type.startsWith("image/"))
    if (imageFiles.length === 0) {
      setUploadError("Only image files (JPEG, PNG, WebP, etc.) are accepted.")
      return
    }
    if (imageFiles.length < files.length) {
      setUploadError(`${files.length - imageFiles.length} non-image file(s) skipped.`)
    }

    const title = imageTitle.trim() || SITE_NAME
    setLoading(true)
    setDone(0)

    let count = 0
    for (const file of imageFiles) {
      const ok = await uploadOne(file, title)
      if (ok) count++
      setDone(count)
    }

    setLoading(false)
    setFiles(null)
    setImageTitle("")
    toast(`${count} image(s) uploaded with title: "${title}"`)
  }

  async function addVideo() {
    if (!ytUrl) return
    setAddingVideo(true)
    await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "video", url: ytUrl, title: ytTitle.trim() || SITE_NAME }),
    })
    setYtUrl("")
    setYtTitle("")
    setAddingVideo(false)
    toast("Video added")
  }

  if (authLoading) return <div className="min-h-screen bg-slate-50 dark:bg-navy-900 flex items-center justify-center"><Loader className="w-8 h-8 animate-spin text-brand-600" /></div>
  if (!user || !user.isAdmin) return null

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-950 py-8 px-4 sm:px-6">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Photo upload */}
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-slate-200 dark:border-navy-700 shadow-xl">
          <h1 className="text-2xl font-bold text-navy-800 dark:text-white flex items-center gap-2 mb-6">
            <ImageIcon className="w-6 h-6 text-brand-600" /> Upload Images
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-800 dark:text-white mb-1.5">Image Title / Alt Text</label>
              <input type="text" placeholder="e.g. Poultry Exhibition Stall — Conclave 2026" value={imageTitle} onChange={(e) => setImageTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Same title will be used as alt text for all uploaded images.</p>
            </div>
            <input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-brand-50 dark:file:bg-brand-900/30 file:text-brand-700 dark:file:text-brand-300 file:font-semibold file:cursor-pointer" />
            {uploadError && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">{uploadError}</p>
            )}
            <button type="submit" disabled={loading || !files || files.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-60">
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {loading ? `Uploading ${done}/${files?.length}...` : "Upload to Gallery"}
            </button>
            {done > 0 && done === (files?.length || 0) && (
              <p className="text-sm text-green-600 dark:text-green-400 text-center font-medium">All uploaded!</p>
            )}
          </form>
        </div>

        {/* YouTube video */}
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-slate-200 dark:border-navy-700 shadow-xl">
          <h2 className="text-xl font-bold text-navy-800 dark:text-white flex items-center gap-2 mb-4">
            <FaYoutube className="w-6 h-6 text-red-500" /> Add YouTube Video
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-800 dark:text-white mb-1.5">Title</label>
              <input type="text" placeholder="Video title" value={ytTitle} onChange={(e) => setYtTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-800 dark:text-white mb-1.5">YouTube URL</label>
              <input type="url" placeholder="https://youtube.com/watch?v=..." value={ytUrl} onChange={(e) => setYtUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <button onClick={addVideo} disabled={addingVideo || !ytUrl}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-60">
              {addingVideo ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add Video
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
