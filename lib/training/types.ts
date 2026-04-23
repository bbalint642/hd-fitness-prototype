/**
 * Firestore-backed training model.
 *
 * Shape:
 *   users/{uid}/workouts/{workoutId}
 *     date: "YYYY-MM-DD"
 *     exercises: WorkoutExercise[]
 *       sets: WorkoutSet[]   (length == targetSets)
 */

export type WeightUnit = "kg" | "lbs"

export interface WorkoutSet {
  /** 1-based position within the exercise's sets array. */
  index: number
  performedReps: number | null
  performedWeight: number | null
  performedRir: number | null
  clientNote: string
  hasVideo: boolean
}

export interface WorkoutExercise {
  id: string
  order: number
  name: string
  targetSets: number
  /** Free-text rep range ("6-9", "10-13"). */
  targetRepRange: string
  targetWeight: number | null
  targetRir: number | null
  coachNote: string
  sets: WorkoutSet[]
}

export interface Workout {
  id: string
  /** Owning user's Firebase Auth UID. Not stored on the doc (implied by path). */
  userId: string
  /** "YYYY-MM-DD" — sortable lexicographically. */
  date: string
  dayTitle: string
  weightUnit: WeightUnit
  exercises: WorkoutExercise[]
  /** ISO-formatted timestamps, populated from Firestore server timestamps. */
  createdAt: string | null
  updatedAt: string | null
}

export type ExercisePrescriptionPatch = Partial<
  Pick<
    WorkoutExercise,
    "targetSets" | "targetRepRange" | "targetWeight" | "targetRir" | "coachNote"
  >
>

export type SetPerformancePatch = Partial<
  Pick<
    WorkoutSet,
    "performedReps" | "performedWeight" | "performedRir" | "clientNote" | "hasVideo"
  >
>
