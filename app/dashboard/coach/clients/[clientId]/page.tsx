"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { TrainingWeekView } from "@/components/training/training-week-view"
import { Button } from "@/components/ui/button"
import { getClientById } from "@/lib/auth/firebase-users"
import type { AuthUser } from "@/lib/auth/types"

type LoadState =
  | { status: "loading" }
  | { status: "not_found" }
  | { status: "error"; message: string }
  | { status: "ready"; client: AuthUser }

export default function CoachClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = use(params)

  return (
    <ProtectedRoute requiredRole="coach">
      <ClientDetailContent clientId={clientId} />
    </ProtectedRoute>
  )
}

function ClientDetailContent({ clientId }: { clientId: string }) {
  const [state, setState] = useState<LoadState>({ status: "loading" })

  useEffect(() => {
    let cancelled = false
    setState({ status: "loading" })
    getClientById(clientId)
      .then((client) => {
        if (cancelled) return
        if (!client) {
          setState({ status: "not_found" })
        } else {
          setState({ status: "ready", client })
        }
      })
      .catch((err) => {
        console.error("Failed to load client from Firestore:", err)
        if (!cancelled) {
          setState({
            status: "error",
            message: "Nem sikerült betölteni az ügyfelet.",
          })
        }
      })
    return () => {
      cancelled = true
    }
  }, [clientId])

  if (state.status === "loading") {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Ügyfél betöltése…</span>
      </section>
    )
  }

  if (state.status === "not_found") {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link href="/dashboard/coach/clients">
            <ArrowLeft className="h-4 w-4" />
            Vissza az ügyféllistához
          </Link>
        </Button>
        <h1 className="font-serif text-3xl font-bold uppercase tracking-wide text-foreground">
          Ügyfél nem található
        </h1>
        <p className="text-muted-foreground">
          A keresett ügyfél (<span className="font-mono">{clientId}</span>) nem
          létezik a Firestore <span className="font-mono">users</span>{" "}
          kollekcióban, vagy nincs <span className="font-mono">client</span>{" "}
          szerepköre.
        </p>
      </section>
    )
  }

  if (state.status === "error") {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link href="/dashboard/coach/clients">
            <ArrowLeft className="h-4 w-4" />
            Vissza az ügyféllistához
          </Link>
        </Button>
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.message}
        </div>
      </section>
    )
  }

  return <ClientTrainingView client={state.client} />
}

function ClientTrainingView({ client }: { client: AuthUser }) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 md:py-16 space-y-6 md:space-y-8">
      <div className="space-y-3 md:space-y-4">
        <Button asChild variant="ghost" size="sm" className="gap-2 -ml-3">
          <Link href="/dashboard/coach/clients">
            <ArrowLeft className="h-4 w-4" />
            Vissza az ügyféllistához
          </Link>
        </Button>

        <div className="flex flex-wrap items-baseline justify-between gap-3 md:gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-4xl font-bold uppercase tracking-wide text-foreground">
              {client.displayName}{" "}
              <span className="text-primary">edzésterve</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm md:text-base text-muted-foreground">
              Coach nézet – minden cella szerkeszthető. A módosítások azonnal
              láthatók lesznek a kliens nézetében.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            Coach szerkesztés
          </span>
        </div>
      </div>

      <TrainingWeekView userId={client.id} mode="coach" />
    </section>
  )
}
