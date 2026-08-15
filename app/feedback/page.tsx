"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Star, Loader2, Send, MessageSquare, CheckCircle, Heart } from "lucide-react"

const categories = [
  "Overall Event Experience",
  "Sessions & Speakers",
  "Exhibition & Expo",
  "Venue & Facilities",
  "Registration & ID Cards",
  "Food & Hospitality",
  "Other",
]

const ratingComments: Record<number, string[]> = {
  5: ["Outstanding event!", "Well organised & world class", "Excellent speakers", "Highly recommended", "Superb experience"],
  4: ["Great event overall", "Very good organisation", "Good sessions", "Enjoyed the expo", "Nice venue"],
  3: ["Good but can improve", "Average experience", "Some sessions were good", "Venue could be better", "Decent event"],
  2: ["Needs improvement", "Disappointing in parts", "Organisation issues", "Not worth the travel", "Below expectations"],
  1: ["Very poor experience", "Not organised well", "Waste of time", "Bad venue", "Poor communication"],
}

const ratingLabels = [
  "",
  "Poor",
  "Fair",
  "Good",
  "Very Good",
  "Excellent",
]

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [name, setName] = useState("")
  const [category, setCategory] = useState(categories[0])
  const [comment, setComment] = useState("")
  const [custom, setCustom] = useState("")
  const [showCustom, setShowCustom] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) {
      setError("Please select a star rating.")
      return
    }
    if (!name.trim()) {
      setError("Please enter your name.")
      return
    }
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          rating,
          category: showCustom ? "Other" : category,
          comment: showCustom ? custom.trim() : comment,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to submit feedback. Please try again.")
        return
      }
      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function pickComment(c: string) {
    setComment(c)
    setShowCustom(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-accent-50 text-accent-700 dark:bg-accent-950/60 dark:text-accent-300 border border-accent-200/60 dark:border-accent-800/60 mb-3 shadow-xs">
            <Heart className="w-3.5 h-3.5" />
            Your Opinion Matters
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Share Your <span className="text-gradient">Feedback</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            How was your experience at the 1st Poultry Conclave Gorakhpur 2026? Your feedback helps us
            make the next edition even better.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-lg p-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-5">
              <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Thank You, {name.split(" ")[0]}!
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto mb-6">
              Your feedback has been submitted successfully. We appreciate you taking the time to share
              your experience with us.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false)
                setRating(0)
                setName("")
                setComment("")
                setCustom("")
                setShowCustom(false)
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-colors"
            >
              Submit Another Feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-lg p-6 sm:p-8">
            {/* Rating */}
            <div className="mb-8">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Rate Your Experience <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHover(n)}
                      onMouseLeave={() => setHover(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-9 h-9 sm:w-11 sm:h-11 transition-colors ${
                          (hover || rating) >= n
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 dark:text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="ml-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {rating ? ratingLabels[rating] : "Tap to rate"}
                </span>
              </div>
              {rating > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    Pick a quick comment (optional):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(ratingComments[rating] || []).map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => pickComment(c)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          comment === c
                            ? "bg-brand-600 text-white border-brand-600"
                            : "bg-slate-50 dark:bg-navy-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-navy-700 hover:border-brand-400"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowCustom(true)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        showCustom
                          ? "bg-brand-600 text-white border-brand-600"
                          : "bg-slate-50 dark:bg-navy-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-navy-700 hover:border-brand-400"
                      }`}
                    >
                      ✍️ Write my own
                    </button>
                  </div>
                  {showCustom && (
                    <textarea
                      rows={3}
                      placeholder="Type your own comment here..."
                      value={custom}
                      onChange={e => setCustom(e.target.value)}
                      className="w-full mt-3 px-4 py-3 rounded-xl border border-slate-300 dark:border-navy-600 text-sm bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all resize-none"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-navy-600 text-sm bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Name */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-navy-600 text-sm bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 mb-6">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Feedback
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <MessageSquare className="w-3.5 h-3.5" />
          Your responses are sent directly to the conclave organising team.
        </div>
      </main>
      <Footer />
    </div>
  )
}
