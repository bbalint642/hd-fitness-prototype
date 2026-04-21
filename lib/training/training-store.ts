"use client"

import { useSyncExternalStore } from "react"
import { seedTrainingPlan } from "./mock-training-data"
import type {
  ExerciseRow,
  SeriesField,
  SeriesSlot,
  TrainingExercise,
  TrainingPlan,
} from "./types"

/**
 * Per-user in-memory training store. State lives at module scope so it
 * survives client-side navigations within the same tab, and is discarded on
 * reload. Swap this module's internals for Firestore reads/writes later
 * without touching the UI.
 */

type Listener = () => void

const plans = new Map<string, TrainingPlan>()
const listeners = new Set<Listener>()

function ensurePlan(userId: string): TrainingPlan {
  let plan = plans.get(userId)
  if (!plan) {
    plan = seedTrainingPlan(userId)
    plans.set(userId, plan)
  }
  return plan
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function notify(): void {
  for (const listener of listeners) listener()
}

function getSnapshot(userId: string): TrainingPlan {
  return ensurePlan(userId)
}

export function useTrainingPlan(userId: string): TrainingPlan {
  return useSyncExternalStore(
    subscribe,
    () => getSnapshot(userId),
    () => getSnapshot(userId),
  )
}

type ExerciseMutator = (exercise: TrainingExercise) => TrainingExercise
type RowMutator = (row: ExerciseRow) => ExerciseRow

function mapExercise(
  plan: TrainingPlan,
  dayId: string,
  exerciseId: string,
  mutator: ExerciseMutator,
): TrainingPlan {
  return {
    ...plan,
    weeks: plan.weeks.map((week) => ({
      ...week,
      days: week.days.map((day) =>
        day.id !== dayId
          ? day
          : {
              ...day,
              exercises: day.exercises.map((exercise) =>
                exercise.id !== exerciseId ? exercise : mutator(exercise),
              ),
            },
      ),
    })),
  }
}

function mapRow(
  plan: TrainingPlan,
  dayId: string,
  exerciseId: string,
  rowId: string,
  mutator: RowMutator,
): TrainingPlan {
  return mapExercise(plan, dayId, exerciseId, (exercise) => ({
    ...exercise,
    rows: exercise.rows.map((row) => (row.id !== rowId ? row : mutator(row))),
  }))
}

function commit(userId: string, next: TrainingPlan): void {
  plans.set(userId, next)
  notify()
}

export function updateRowField(
  userId: string,
  dayId: string,
  exerciseId: string,
  rowId: string,
  field: "setsCount" | "repRange",
  value: number | string | null,
): void {
  const plan = ensurePlan(userId)
  const next = mapRow(plan, dayId, exerciseId, rowId, (row) => {
    if (field === "setsCount") {
      return { ...row, setsCount: value as number | null }
    }
    return { ...row, repRange: (value ?? "") as string }
  })
  commit(userId, next)
}

export function updateSeriesField(
  userId: string,
  dayId: string,
  exerciseId: string,
  rowId: string,
  slot: SeriesSlot,
  field: SeriesField,
  value: number | null,
): void {
  const plan = ensurePlan(userId)
  const next = mapRow(plan, dayId, exerciseId, rowId, (row) => ({
    ...row,
    [slot]: { ...row[slot], [field]: value },
  }))
  commit(userId, next)
}

export function updateExerciseNote(
  userId: string,
  dayId: string,
  exerciseId: string,
  field: "coachNote" | "clientNote" | "videoNote",
  value: string,
): void {
  const plan = ensurePlan(userId)
  const next = mapExercise(plan, dayId, exerciseId, (exercise) => ({
    ...exercise,
    [field]: value,
  }))
  commit(userId, next)
}

export function updateExerciseName(
  userId: string,
  dayId: string,
  exerciseId: string,
  value: string,
): void {
  const plan = ensurePlan(userId)
  const next = mapExercise(plan, dayId, exerciseId, (exercise) => ({
    ...exercise,
    name: value,
  }))
  commit(userId, next)
}
