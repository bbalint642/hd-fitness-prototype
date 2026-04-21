"use client"

import * as React from "react"
import { motion, useInView } from "motion/react"

import { cn } from "@/lib/utils"

interface BlurRevealProps {
  className?: string
  children: React.ReactNode
  delay?: number
  duration?: number
}

export function BlurReveal({
  className,
  children,
  delay = 0,
  duration = 1,
}: BlurRevealProps) {
  const spanRef = React.useRef<HTMLSpanElement>(null)
  const isInView: boolean = useInView(spanRef, { once: true })

  return (
    <motion.span
      ref={spanRef}
      initial={{ filter: "blur(10px)", opacity: 0, y: 12 }}
      animate={
        isInView
          ? { filter: "blur(0px)", opacity: 1, y: 0 }
          : { filter: "blur(10px)", opacity: 0, y: 12 }
      }
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("inline-block will-change-[filter,opacity,transform]", className)}
    >
      {children}
    </motion.span>
  )
}
