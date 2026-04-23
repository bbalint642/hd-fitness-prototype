"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { TrainingWeekView } from "@/components/training/training-week-view"
import { useAuth } from "@/lib/auth/auth-provider"

export default function ClientTrainingPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <TrainingContent />
    </ProtectedRoute>
  )
}

function TrainingContent() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 md:py-16 space-y-6 md:space-y-8">
      <div>
        <h1 className="font-serif text-2xl md:text-4xl font-bold uppercase tracking-wide text-foreground">
          Ed<span className="text-primary">zés</span>
        </h1>
        <p className="mt-2 md:mt-4 max-w-2xl text-sm md:text-base text-muted-foreground">
          Vezesd az aktuális edzéshetedet. Bármikor vissza- vagy előreléphetsz
          a heti léptetővel – a módosításaid azonnal rögzülnek a felhőben.
        </p>
      </div>

      <TrainingWeekView userId={user.id} mode="client" />
    </section>
  )
}
