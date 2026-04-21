"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"

export default function ClientDashboardPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-serif text-4xl font-bold uppercase tracking-wide text-foreground">
          Kliens <span className="text-primary">Dashboard</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Üdvözlünk! Itt fogod nyomon követni az edzéseidet és a fejlődésedet.
        </p>
      </section>
    </ProtectedRoute>
  )
}
