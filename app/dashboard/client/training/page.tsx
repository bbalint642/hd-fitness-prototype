"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { TrainingWeekTable } from "@/components/training/training-week"
import { useAuth } from "@/lib/auth/auth-provider"
import { useTrainingPlan } from "@/lib/training/training-store"

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

  return <TrainingPlanView userId={user.id} />
}

function TrainingPlanView({ userId }: { userId: string }) {
  const plan = useTrainingPlan(userId)

  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 md:py-16 space-y-6 md:space-y-8">
      <div>
        <h1 className="font-serif text-2xl md:text-4xl font-bold uppercase tracking-wide text-foreground">
          Ed<span className="text-primary">zés</span>
        </h1>
        <p className="mt-2 md:mt-4 max-w-2xl text-sm md:text-base text-muted-foreground">
          Vezesd az aktuális edzéshetedet. A módosítások a böngésző lapjának
          bezárásáig megmaradnak; később valós adatbázishoz kötjük.
        </p>
      </div>

      <div className="space-y-6 md:space-y-8">
        {plan.weeks.map((week) => (
          <TrainingWeekTable key={week.id} userId={userId} week={week} />
        ))}
      </div>
    </section>
  )
}
