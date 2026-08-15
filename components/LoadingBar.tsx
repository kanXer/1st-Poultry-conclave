'use client'

import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function LoadingBar() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const isMounted = useRef(false)

  useEffect(() => {
    // Skip on first render (page load / refresh)
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    setVisible(true)
    setProgress(20)

    // Quick jump to 60%
    const t1 = setTimeout(() => setProgress(60), 100)
    // Slow crawl to 85%
    const t2 = setTimeout(() => setProgress(85), 250)
    // Complete
    const t3 = setTimeout(() => setProgress(100), 400)
    // Hide after complete
    const t4 = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 700)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [pathname])

  if (!visible && progress === 0) return null

  return (
    <div
      className="fixed left-0 right-0 z-[60] h-[3px] bg-transparent"
      style={{ top: 0 }}
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-brand-400 via-accent-500 to-brand-600 transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "200ms" : "400ms",
          boxShadow: "0 0 10px rgba(242,92,13,0.7), 0 0 4px rgba(242,92,13,0.5)",
        }}
      />
    </div>
  )
}
