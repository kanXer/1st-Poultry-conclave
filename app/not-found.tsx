import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-navy-900 px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900/40 dark:to-accent-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-extrabold text-gradient">!</span>
        </div>
        <h1 className="text-7xl font-extrabold text-gradient mb-2">404</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-2 text-lg">Page not found</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
