"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import useMeasure from "react-use-measure"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserIcon,
  SettingsIcon,
  LogoutIcon,
  ArrowDown01Icon,
  Dumbbell01Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons"
import { useAuth } from "@/lib/auth/auth-provider"
import type { UserRole } from "@/lib/auth/types"

type MenuItemId =
  | "profile"
  | "settings"
  | "training"
  | "clients"
  | "divider"
  | "logout"

interface MenuItem {
  id: MenuItemId
  label: string
  icon: typeof UserIcon | null
  href?: string
}

function getMenuItems(role: UserRole): MenuItem[] {
  const roleSpecific: MenuItem =
    role === "coach"
      ? {
          id: "clients",
          label: "Ügyfelek",
          icon: UserMultipleIcon,
          href: "/dashboard/coach/clients",
        }
      : {
          id: "training",
          label: "Edzés",
          icon: Dumbbell01Icon,
          href: "/dashboard/client/training",
        }

  return [
    { id: "profile", label: "Profil", icon: UserIcon },
    roleSpecific,
    { id: "settings", label: "Beállítások", icon: SettingsIcon },
    { id: "divider", label: "", icon: null },
    { id: "logout", label: "Kilépés", icon: LogoutIcon },
  ]
}

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1]

const MENU_WIDTH = 240
const CLOSED_HEIGHT = 36
const CLOSED_RADIUS = 8
const OPEN_RADIUS = 14

export function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<MenuItemId | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [contentRef, contentBounds] = useMeasure()

  const menuItems = useMemo(
    () => (user ? getMenuItems(user.role) : []),
    [user],
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  if (!user) return null

  const initial = user.displayName.charAt(0).toUpperCase()
  const openHeight = Math.max(CLOSED_HEIGHT, Math.ceil(contentBounds.height))

  const handleItemClick = async (item: MenuItem) => {
    if (item.id === "logout") {
      setIsOpen(false)
      await logout()
      router.push("/")
      return
    }
    if (item.href) {
      setIsOpen(false)
      router.push(item.href)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative not-prose"
      style={{ width: MENU_WIDTH, height: CLOSED_HEIGHT }}
    >
      <motion.div
        layout
        initial={false}
        animate={{
          width: MENU_WIDTH,
          height: isOpen ? openHeight : CLOSED_HEIGHT,
          borderRadius: isOpen ? OPEN_RADIUS : CLOSED_RADIUS,
        }}
        transition={{
          type: "spring" as const,
          damping: 34,
          stiffness: 380,
          mass: 0.8,
        }}
        className="absolute top-0 right-0 bg-popover border border-border shadow-sm overflow-hidden cursor-pointer origin-top-right"
        onClick={() => !isOpen && setIsOpen(true)}
      >
        {/* Closed state: avatar + username, same shape as primary buttons */}
        <motion.div
          initial={false}
          animate={{
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 0.95 : 1,
          }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 flex items-center gap-2 px-2"
          style={{
            pointerEvents: isOpen ? "none" : "auto",
            willChange: "transform",
          }}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-xs">
            {initial}
          </span>
          <span className="flex-1 truncate text-sm font-medium text-foreground">
            {user.displayName}
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className="h-4 w-4 shrink-0 text-muted-foreground"
          />
        </motion.div>

        {/* Open state: menu content */}
        <div ref={contentRef}>
          <motion.div
            layout
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{
              duration: 0.2,
              delay: isOpen ? 0.08 : 0,
            }}
            className="p-2"
            style={{
              pointerEvents: isOpen ? "auto" : "none",
              willChange: "transform",
            }}
          >
            {/* Header: user info */}
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{
                opacity: isOpen ? 1 : 0,
                x: isOpen ? 0 : 8,
              }}
              transition={{
                delay: isOpen ? 0.06 : 0,
                duration: 0.15,
                ease: easeOutQuint,
              }}
              className="flex items-center gap-3 px-2 py-2"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                {initial}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-foreground">
                  {user.displayName}
                </span>
                <span className="text-xs uppercase tracking-wider text-primary">
                  {user.role === "coach" ? "Coach" : "Kliens"}
                </span>
              </div>
            </motion.div>

            <motion.hr
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ delay: isOpen ? 0.1 : 0 }}
              className="border-border my-1.5"
            />

            <ul className="m-0 flex flex-col gap-0.5 p-0 list-none">
              {menuItems.map((item, index) => {
                if (item.id === "divider") {
                  return (
                    <motion.hr
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isOpen ? 1 : 0 }}
                      transition={{
                        delay: isOpen ? 0.12 + index * 0.015 : 0,
                      }}
                      className="border-border my-1.5"
                    />
                  )
                }

                const iconRef = item.icon!
                const isLogout = item.id === "logout"
                const showIndicator = hoveredItem === item.id
                const itemDuration = isLogout ? 0.12 : 0.15
                const itemDelay = isOpen ? 0.08 + index * 0.02 : 0

                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{
                      opacity: isOpen ? 1 : 0,
                      x: isOpen ? 0 : 8,
                    }}
                    transition={{
                      delay: itemDelay,
                      duration: itemDuration,
                      ease: easeOutQuint,
                    }}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`relative flex items-center gap-3 rounded-lg pl-3 py-2 m-0 text-sm cursor-pointer transition-colors duration-200 ease-out ${
                      isLogout && showIndicator
                        ? "text-destructive"
                        : isLogout
                          ? "text-muted-foreground hover:text-destructive"
                          : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {showIndicator && (
                      <motion.div
                        layoutId="userMenuActiveIndicator"
                        className={`absolute inset-0 rounded-lg ${
                          isLogout ? "bg-destructive/10" : "bg-muted"
                        }`}
                        transition={{
                          type: "spring",
                          damping: 30,
                          stiffness: 520,
                          mass: 0.8,
                        }}
                      />
                    )}
                    {showIndicator && (
                      <motion.div
                        layoutId="userMenuLeftBar"
                        className={`absolute left-0 top-0 bottom-0 my-auto w-[3px] h-5 rounded-full ${
                          isLogout ? "bg-destructive" : "bg-primary"
                        }`}
                        transition={{
                          type: "spring",
                          damping: 30,
                          stiffness: 520,
                          mass: 0.8,
                        }}
                      />
                    )}
                    <HugeiconsIcon
                      icon={iconRef}
                      className="w-[18px] h-[18px] relative z-10"
                    />
                    <span className="font-medium relative z-10">
                      {item.label}
                    </span>
                  </motion.li>
                )
              })}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
