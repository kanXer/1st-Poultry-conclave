'use client'

import { useEffect, useRef, useState } from "react"

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  gradient?: boolean
  stagger?: number
  tag?: "span" | "div"
}

export default function TextReveal({
  text,
  className = "",
  delay = 0,
  gradient = false,
  stagger = 55,
  tag: Tag = "span",
}: TextRevealProps) {
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement | HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true)
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={ref as any} className={className} aria-label={text}>
      {text.split("").map((char, i) => {
        const letterStyle: React.CSSProperties = {
          opacity: started ? 1 : 0,
          transform: started ? "translateY(0) scale(1)" : "translateY(1.1em) scale(0.9)",
          filter: started ? "blur(0)" : "blur(6px)",
          transition: `opacity 0.6s ease ${delay + i * stagger}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay + i * stagger}ms, filter 0.5s ease ${delay + i * stagger}ms`,
        }
        if (gradient) {
          letterStyle.backgroundImage = "linear-gradient(135deg, var(--color-brand-600), var(--color-accent-600))"
          letterStyle.WebkitBackgroundClip = "text"
          letterStyle.backgroundClip = "text"
          letterStyle.color = "transparent"
          letterStyle.WebkitTextFillColor = "transparent"
        }
        return (
          <span
            key={i}
            className="inline-block will-change-transform"
            style={letterStyle}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        )
      })}
    </Tag>
  )
}