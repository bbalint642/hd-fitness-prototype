"use client"

import { useCallback, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWorkoutsInRange } from "@/lib/training/hooks"
import {
  addDays,
  endOfWeek,
  formatWeekRangeHu,
  startOfWeek,
  toYyyyMmDd,
} from "@/lib/training/date-utils"
import type { Workout } from "@/lib/training/types"
import { WorkoutDayView, type TrainingMode } from "./training-week"

interface TrainingWeekViewProps {
  userId: string
  mode?: TrainingMode
}

/**
 * Displays one Monday-to-Sunday week of workouts for `userId`, with
 * prev/next navigation and a "mai hét" reset button. Subscribes in real
 * time, so any coach edit appears in the client's view immediately.
 */
export function TrainingWeekView({ userId, mode = "client" }: TrainingWeekViewProps) {
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()))
  const weekEnd = useMemo(() => endOfWeek(weekStart), [weekStart])

  const fromYmd = toYyyyMmDd(weekStart)
  const toYmd = toYyyyMmDd(weekEnd)

  const goPrev = useCallback(() => {
    setWeekStart((prev) => addDays(prev, -7))
  }, [])
  const goNext = useCallback(() => {
    setWeekStart((prev) => addDays(prev, 7))
  }, [])
  const goToday = useCallback(() => {
    setWeekStart(startOfWeek(new Date()))
  }, [])

  const state = useWorkoutsInRange(userId, fromYmd, toYmd)

  const isCurrentWeek = useMemo(() => {
    const todayWeekStart = startOfWeek(new Date())
    return toYyyyMmDd(todayWeekStart) === fromYmd
  }, [fromYmd])

  return (
    <div className="space-y-6 md:space-y-8">
      <WeekNav
        rangeLabel={formatWeekRangeHu(weekStart)}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
        isCurrentWeek={isCurrentWeek}
      />

      {state.status === "loading" ? (
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Edzések betöltése…</span>
        </div>
      ) : state.status === "error" ? (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.message}
        </div>
      ) : (
        <WeekWorkouts workouts={state.workouts} mode={mode} />
      )}
    </div>
  )
}

function WeekNav({
  rangeLabel,
  onPrev,
  onNext,
  onToday,
  isCurrentWeek,
}: {
  rangeLabel: string
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  isCurrentWeek: boolean
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card/60 px-3 py-2 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrev}
          aria-label="Előző hét"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-[180px] text-center">
          <p className="font-serif text-sm font-semibold uppercase tracking-wider text-foreground">
            {rangeLabel}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          aria-label="Következő hét"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onToday}
        disabled={isCurrentWeek}
      >
        Mai hét
      </Button>
    </div>
  )
}

function WeekWorkouts({
  workouts,
  mode,
}: {
  workouts: Workout[]
  mode: TrainingMode
}) {
  if (workouts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card/40 px-4 py-10 text-center">
        <p className="text-sm text-muted-foreground">
          Erre a hétre még nincs rögzített edzés.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {workouts.map((workout) => (
        <WorkoutDayView key={workout.id} workout={workout} mode={mode} />
      ))}
    </div>
  )
}
