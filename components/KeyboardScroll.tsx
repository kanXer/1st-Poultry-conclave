"use client"

import { useEffect } from "react"

export default function KeyboardScroll() {
  useEffect(() => {
    const isFormControl = (el: Element | null) =>
      !!el &&
      (el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement)

    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as Element
      if (isFormControl(el)) {
        ;(el as HTMLElement).scrollIntoView({ block: "center", behavior: "auto" })
      }
    }

    document.addEventListener("focusin", onFocusIn, true)

    return () => {
      document.removeEventListener("focusin", onFocusIn, true)
    }
  }, [])

  return null
}