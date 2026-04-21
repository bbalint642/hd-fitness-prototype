"use client"

import Link from "next/link"
import { ArrowDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const MIN_DELAY_MS = 6000
const MAX_DELAY_MS = 10000
const NUDGE_DURATION_MS = 1200

export function LearnMoreCta() {
  const [nudging, setNudging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const hoveredRef = useRef(false)

  useEffect(() => {
    hoveredRef.current = hovered
  }, [hovered])

  useEffect(() => {
    if (typeof window === "undefined") return
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    let scheduleTimer: number | undefined
    let endTimer: number | undefined

    const scheduleNext = () => {
      const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)
      scheduleTimer = window.setTimeout(() => {
        if (hoveredRef.current) {
          scheduleNext()
          return
        }
        setNudging(true)
        endTimer = window.setTimeout(() => {
          setNudging(false)
          scheduleNext()
        }, NUDGE_DURATION_MS)
      }, delay)
    }

    scheduleNext()

    return () => {
      if (scheduleTimer) window.clearTimeout(scheduleTimer)
      if (endTimer) window.clearTimeout(endTimer)
    }
  }, [])

  const showNudge = nudging && !hovered

  return (
    <Link
      href="#szolgaltatasok"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full px-2 py-3 text-base font-semibold uppercase tracking-wide text-foreground/90",
        "outline-none transition-transform duration-300 ease-out will-change-transform",
        "hover:scale-[1.05] hover:text-primary focus-visible:scale-[1.05] focus-visible:text-primary",
      )}
    >
      <span className="relative">
        Tudj meg többet
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
      </span>
      <ArrowDown
        aria-hidden
        className={cn(
          "h-5 w-5 text-primary transition-transform duration-300 ease-out",
          showNudge && "animate-nudge-down",
        )}
      />
    </Link>
  )
}
