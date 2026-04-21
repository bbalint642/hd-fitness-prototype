"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Loader2 } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getClientUsers } from "@/lib/auth/firebase-users"
import type { AuthUser } from "@/lib/auth/types"

export default function CoachClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<AuthUser[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getClientUsers()
      .then((users) => {
        if (!cancelled) setClients(users)
      })
      .catch((err) => {
        console.error("Failed to load clients from Firestore:", err)
        if (!cancelled) {
          setError("Nem sikerült betölteni az ügyféllistát.")
          setClients([])
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <ProtectedRoute requiredRole="coach">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-serif text-4xl font-bold uppercase tracking-wide text-foreground">
          Ügy<span className="text-primary">felek</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Az ügyféllista a Firestore <span className="font-mono">users</span>{" "}
          kollekcióból töltődik (role == &quot;client&quot;). Kattints egy
          ügyfélre a edzéstervének megnyitásához és szerkesztéséhez.
        </p>

        <Card className="mt-10 border-border bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-serif text-xl uppercase tracking-wide">
              Ügyféllista
            </CardTitle>
            <CardDescription>
              {clients === null
                ? "Betöltés…"
                : `${clients.length} regisztrált kliens.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clients === null ? (
              <div className="flex items-center gap-3 py-8 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Ügyfelek betöltése…</span>
              </div>
            ) : error ? (
              <div
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </div>
            ) : clients.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Még nincs ügyfél a rendszerben.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      Felhasználónév
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Megjelenített név
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Belső azonosító
                    </TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => {
                    const openClient = () =>
                      router.push(`/dashboard/coach/clients/${client.id}`)

                    return (
                      <TableRow
                        key={client.id}
                        onClick={openClient}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault()
                            openClient()
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`${client.displayName} edzéstervének megnyitása`}
                        className="cursor-pointer transition-colors hover:bg-primary/5 focus:outline-none focus-visible:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        <TableCell className="font-medium text-foreground">
                          {client.username}
                        </TableCell>
                        <TableCell>{client.displayName}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {client.id}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          <ChevronRight className="inline h-4 w-4" />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </ProtectedRoute>
  )
}
