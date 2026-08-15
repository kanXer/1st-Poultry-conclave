"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export default function ScrollToTop() {
  const pathname = usePathname()
  const firstRender = useRef(true)

  useEffect(() => {
    // Don't scroll on initial load — lets the browser restore scroll position on refresh
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
