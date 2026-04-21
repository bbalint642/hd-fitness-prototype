"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"

export default function CoachDashboardPage() {
  return (
    <ProtectedRoute requiredRole="coach">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-serif text-4xl font-bold uppercase tracking-wide text-foreground">
          Coach <span className="text-primary">Dashboard</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Üdvözlünk! Itt fogod kezelni a klienseidet és az edzésterveket.
        </p>
      </section>
    </ProtectedRoute>
  )
}
