"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/lib/auth/auth-provider"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return
    if (user) {
      router.replace(
        user.role === "coach" ? "/dashboard/coach" : "/dashboard/client",
      )
    }
  }, [user, isLoading, router])

  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />

      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[160px]"
        aria-hidden="true"
      />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        {isLoading || user ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <LoginForm />
        )}
      </section>
    </main>
  )
}
