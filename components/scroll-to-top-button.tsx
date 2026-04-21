"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  const updateVisibility = useCallback(() => {
    const hero = document.getElementById("hero")
    if (!hero) {
      setVisible(false)
      return
    }
    const rect = hero.getBoundingClientRect()
    // A hero felső 60%-a akkor nincs látható, ha a 60%-os határvonal a viewport teteje fölé került.
    const upperSixtyGone = rect.top + rect.height * 0.6 <= 0
    setVisible(upperSixtyGone)
  }, [])

  useEffect(() => {
    updateVisibility()
    window.addEventListener("scroll", updateVisibility, { passive: true })
    window.addEventListener("resize", updateVisibility, { passive: true })
    return () => {
      window.removeEventListener("scroll", updateVisibility)
      window.removeEventListener("resize", updateVisibility)
    }
  }, [updateVisibility])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    })
  }

  return (
    <Button
      type="button"
      variant="default"
      size="icon-lg"
      aria-label="Vissza az oldal tetejére"
      tabIndex={visible ? 0 : -1}
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full shadow-lg transition-all duration-300 md:bottom-8 md:right-8",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <ChevronUp className="size-6" aria-hidden />
    </Button>
  )
}
