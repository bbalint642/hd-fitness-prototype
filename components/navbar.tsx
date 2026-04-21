"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Dumbbell, LogIn } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserIcon,
  SettingsIcon,
  LogoutIcon,
  Dumbbell01Icon,
  UserMultipleIcon,
  DashboardCircleIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-provider"
import { UserMenu } from "@/components/auth/user-menu"

const navLinks = [
  { href: "/#szolgaltatasok", label: "Szolgáltatások" },
  { href: "/#folyamat", label: "Hogyan működik" },
  { href: "/#videok", label: "Videótár" },
  { href: "/#kapcsolat", label: "Kapcsolat" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLoading, logout } = useAuth()

  const dashboardHref =
    user?.role === "coach" ? "/dashboard/coach" : "/dashboard/client"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground font-serif uppercase tracking-wide">
              Hergert <span className="text-primary">Fitness</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/#kapcsolat">Ingyenes konzultáció</Link>
              </Button>
            )}
            {!isLoading && !user && (
              <Button
                asChild
                variant="outline"
                className="border-primary/40 text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary"
              >
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  Belépés
                </Link>
              </Button>
            )}
            {!isLoading && user && <UserMenu />}
          </div>

          <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Button asChild className="w-fit bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/#kapcsolat" onClick={() => setIsOpen(false)}>
                    Ingyenes konzultáció
                  </Link>
                </Button>
              )}
              {!isLoading && !user && (
                <Button
                  asChild
                  variant="outline"
                  className="w-fit border-primary/40 text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary"
                >
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <LogIn className="h-4 w-4" />
                    Belépés
                  </Link>
                </Button>
              )}
              {!isLoading && user && (
                <div className="flex flex-col gap-1 pt-3 mt-1 border-t border-border">
                  <div className="flex items-center gap-3 px-2 py-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      {user.displayName.charAt(0).toUpperCase()}
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {user.displayName}
                      </span>
                      <span className="text-xs uppercase tracking-wider text-primary">
                        {user.role === "coach" ? "Coach" : "Kliens"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={dashboardHref}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <HugeiconsIcon
                      icon={DashboardCircleIcon}
                      className="w-[18px] h-[18px]"
                    />
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
                  >
                    <HugeiconsIcon
                      icon={UserIcon}
                      className="w-[18px] h-[18px]"
                    />
                    Profil
                  </button>

                  {user.role === "coach" ? (
                    <Link
                      href="/dashboard/coach/clients"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <HugeiconsIcon
                        icon={UserMultipleIcon}
                        className="w-[18px] h-[18px]"
                      />
                      Ügyfelek
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard/client/training"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <HugeiconsIcon
                        icon={Dumbbell01Icon}
                        className="w-[18px] h-[18px]"
                      />
                      Edzés
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
                  >
                    <HugeiconsIcon
                      icon={SettingsIcon}
                      className="w-[18px] h-[18px]"
                    />
                    Beállítások
                  </button>

                  <hr className="border-border my-1.5" />

                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors text-left"
                    onClick={async () => {
                      setIsOpen(false)
                      await logout()
                    }}
                  >
                    <HugeiconsIcon
                      icon={LogoutIcon}
                      className="w-[18px] h-[18px]"
                    />
                    Kilépés
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
