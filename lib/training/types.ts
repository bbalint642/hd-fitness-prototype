export interface SeriesEntry {
  reps: number | null
  weight: number | null
  rir: number | null
}

export interface ExerciseRow {
  id: string
  /** "Sor" column – number of prescribed sets for this configuration. */
  setsCount: number | null
  /** "Ism. tart." column – target rep range as free text ("5-8", "10-13"). */
  repRange: string
  series1: SeriesEntry
  series2: SeriesEntry
}

export interface TrainingExercise {
  id: string
  name: string
  rows: ExerciseRow[]
  coachNote: string
  clientNote: string
  videoNote: string
}

export interface TrainingDay {
  id: string
  title: string
  exercises: TrainingExercise[]
}

export interface TrainingWeek {
  id: string
  title: string
  dateRange: string
  days: TrainingDay[]
}

export interface TrainingPlan {
  userId: string
  weeks: TrainingWeek[]
}

/** Fields on a single series cell (reps, weight or RIR). */
export type SeriesField = keyof SeriesEntry

/** Which of the two series (1. or 2.) on a row is being edited. */
export type SeriesSlot = "series1" | "series2"
