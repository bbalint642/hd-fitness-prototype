"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Lock, LogIn, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth/auth-provider"
import { AuthError } from "@/lib/auth/types"

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    setError(null)
    setIsSubmitting(true)

    try {
      const user = await login(email, password)
      router.push(user.role === "coach" ? "/dashboard/coach" : "/dashboard/client")
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message)
      } else {
        setError("Váratlan hiba történt. Próbáld újra.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="relative w-full max-w-md overflow-hidden border-border bg-card/90 backdrop-blur-sm shadow-[0_20px_80px_-20px_rgba(255,191,0,0.15)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <CardHeader className="gap-3 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
          <LogIn className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="font-serif text-3xl font-bold uppercase tracking-wide text-foreground">
          Belé<span className="text-primary">pés</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Lépj be a fiókodba, hogy elérd az edzésterveket és a statisztikáidat.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="neved@pelda.hu"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
                className="h-11 pl-10"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Jelszó
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                className="h-11 pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Jelszó elrejtése" : "Jelszó megjelenítése"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full bg-primary text-primary-foreground font-semibold uppercase tracking-wider shadow-[0_10px_40px_-5px_rgba(255,191,0,0.4)] hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Bejelentkezés…
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Belépés
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Még nincs fiókod?{" "}
            <a
              href="/#kapcsolat"
              className="font-medium text-primary hover:underline"
            >
              Ingyenes konzultáció
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
