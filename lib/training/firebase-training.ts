import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase/firebase-app"
import type {
  ExercisePrescriptionPatch,
  SetPerformancePatch,
  Workout,
  WorkoutExercise,
  WorkoutSet,
} from "./types"

/* ----------------------------- Path helpers ------------------------------ */

function workoutsCollection(userId: string) {
  return collection(getFirebaseDb(), "users", userId, "workouts")
}

function workoutDocRef(userId: string, workoutId: string) {
  return doc(getFirebaseDb(), "users", userId, "workouts", workoutId)
}

/* ------------------------------- Mapping --------------------------------- */

function tsToIso(value: unknown): string | null {
  if (!value) return null
  if (typeof value === "object" && value !== null && "toDate" in value) {
    try {
      return (value as Timestamp).toDate().toISOString()
    } catch {
      return null
    }
  }
  return null
}

function normalizeSet(raw: Partial<WorkoutSet>, fallbackIndex: number): WorkoutSet {
  return {
    index: typeof raw.index === "number" ? raw.index : fallbackIndex,
    performedReps: raw.performedReps ?? null,
    performedWeight: raw.performedWeight ?? null,
    performedRir: raw.performedRir ?? null,
    clientNote: raw.clientNote ?? "",
    hasVideo: Boolean(raw.hasVideo),
  }
}

function normalizeExercise(
  raw: Partial<WorkoutExercise> & { id?: string },
  fallbackOrder: number,
): WorkoutExercise {
  const targetSets =
    typeof raw.targetSets === "number" && raw.targetSets >= 0
      ? Math.floor(raw.targetSets)
      : 0
  const incomingSets = Array.isArray(raw.sets) ? raw.sets : []
  const sets: WorkoutSet[] = []
  for (let i = 0; i < targetSets; i++) {
    const src = incomingSets[i] ?? {}
    sets.push(normalizeSet(src as Partial<WorkoutSet>, i + 1))
  }
  return {
    id: raw.id ?? `ex-${fallbackOrder + 1}`,
    order: typeof raw.order === "number" ? raw.order : fallbackOrder,
    name: raw.name ?? "",
    targetSets,
    targetRepRange: raw.targetRepRange ?? "",
    targetWeight: raw.targetWeight ?? null,
    targetRir: raw.targetRir ?? null,
    coachNote: raw.coachNote ?? "",
    sets,
  }
}

interface WorkoutDocData {
  date?: string
  dayTitle?: string
  weightUnit?: string
  exercises?: unknown[]
  createdAt?: unknown
  updatedAt?: unknown
}

function mapDocToWorkout(
  userId: string,
  id: string,
  data: WorkoutDocData,
): Workout {
  const exercises = Array.isArray(data.exercises) ? data.exercises : []
  return {
    id,
    userId,
    date: data.date ?? "",
    dayTitle: data.dayTitle ?? "",
    weightUnit: data.weightUnit === "lbs" ? "lbs" : "kg",
    exercises: exercises.map((raw, idx) =>
      normalizeExercise(raw as Partial<WorkoutExercise>, idx),
    ),
    createdAt: tsToIso(data.createdAt),
    updatedAt: tsToIso(data.updatedAt),
  }
}

function exerciseToFirestore(exercise: WorkoutExercise): Record<string, unknown> {
  return {
    id: exercise.id,
    order: exercise.order,
    name: exercise.name,
    targetSets: exercise.targetSets,
    targetRepRange: exercise.targetRepRange,
    targetWeight: exercise.targetWeight,
    targetRir: exercise.targetRir,
    coachNote: exercise.coachNote,
    sets: exercise.sets.map((set) => ({
      index: set.index,
      performedReps: set.performedReps,
      performedWeight: set.performedWeight,
      performedRir: set.performedRir,
      clientNote: set.clientNote,
      hasVideo: set.hasVideo,
    })),
  }
}

/* -------------------------------- Reads ---------------------------------- */

export async function getWorkout(
  userId: string,
  workoutId: string,
): Promise<Workout | null> {
  const snap = await getDoc(workoutDocRef(userId, workoutId))
  if (!snap.exists()) return null
  return mapDocToWorkout(userId, snap.id, snap.data() as WorkoutDocData)
}

export async function getWorkoutByDate(
  userId: string,
  dateYmd: string,
): Promise<Workout | null> {
  const q = query(workoutsCollection(userId), where("date", "==", dateYmd))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const first = snap.docs[0]
  return mapDocToWorkout(userId, first.id, first.data() as WorkoutDocData)
}

export async function getWorkoutsInRange(
  userId: string,
  fromYmd: string,
  toYmd: string,
): Promise<Workout[]> {
  const q = query(
    workoutsCollection(userId),
    where("date", ">=", fromYmd),
    where("date", "<=", toYmd),
    orderBy("date", "asc"),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) =>
    mapDocToWorkout(userId, d.id, d.data() as WorkoutDocData),
  )
}

/* ----------------------------- Subscriptions ----------------------------- */

export function subscribeWorkoutsInRange(
  userId: string,
  fromYmd: string,
  toYmd: string,
  onData: (workouts: Workout[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    workoutsCollection(userId),
    where("date", ">=", fromYmd),
    where("date", "<=", toYmd),
    orderBy("date", "asc"),
  )
  return onSnapshot(
    q,
    (snap) => {
      const workouts = snap.docs.map((d) =>
        mapDocToWorkout(userId, d.id, d.data() as WorkoutDocData),
      )
      onData(workouts)
    },
    (err) => {
      console.error("subscribeWorkoutsInRange error:", err)
      onError?.(err)
    },
  )
}

/* ------------------------------- Mutations ------------------------------- */

async function mutateExercises(
  userId: string,
  workoutId: string,
  mutator: (exercises: WorkoutExercise[]) => WorkoutExercise[],
): Promise<void> {
  const db = getFirebaseDb()
  const ref = workoutDocRef(userId, workoutId)
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists()) {
      throw new Error(`Workout not found: users/${userId}/workouts/${workoutId}`)
    }
    const data = snap.data() as WorkoutDocData
    const current = (Array.isArray(data.exercises) ? data.exercises : []).map(
      (raw, idx) => normalizeExercise(raw as Partial<WorkoutExercise>, idx),
    )
    const next = mutator(current).map((ex) => exerciseToFirestore(ex))
    tx.update(ref, {
      exercises: next,
      updatedAt: serverTimestamp(),
    })
  })
}

function syncSetsToTargetCount(exercise: WorkoutExercise): WorkoutExercise {
  const target = Math.max(0, Math.floor(exercise.targetSets))
  const current = exercise.sets
  if (current.length === target) {
    return {
      ...exercise,
      targetSets: target,
      sets: current.map((s, i) => ({ ...s, index: i + 1 })),
    }
  }
  if (current.length < target) {
    const added: WorkoutSet[] = []
    for (let i = current.length; i < target; i++) {
      added.push({
        index: i + 1,
        performedReps: null,
        performedWeight: null,
        performedRir: null,
        clientNote: "",
        hasVideo: false,
      })
    }
    return {
      ...exercise,
      targetSets: target,
      sets: [...current, ...added].map((s, i) => ({ ...s, index: i + 1 })),
    }
  }
  return {
    ...exercise,
    targetSets: target,
    sets: current.slice(0, target).map((s, i) => ({ ...s, index: i + 1 })),
  }
}

export async function updateExerciseName(
  userId: string,
  workoutId: string,
  exerciseId: string,
  name: string,
): Promise<void> {
  await mutateExercises(userId, workoutId, (exercises) =>
    exercises.map((ex) => (ex.id === exerciseId ? { ...ex, name } : ex)),
  )
}

export async function updateExercisePrescription(
  userId: string,
  workoutId: string,
  exerciseId: string,
  patch: ExercisePrescriptionPatch,
): Promise<void> {
  await mutateExercises(userId, workoutId, (exercises) =>
    exercises.map((ex) => {
      if (ex.id !== exerciseId) return ex
      const merged: WorkoutExercise = {
        ...ex,
        ...("targetSets" in patch && patch.targetSets !== undefined
          ? { targetSets: patch.targetSets }
          : {}),
        ...("targetRepRange" in patch && patch.targetRepRange !== undefined
          ? { targetRepRange: patch.targetRepRange }
          : {}),
        ...("targetWeight" in patch
          ? { targetWeight: patch.targetWeight ?? null }
          : {}),
        ...("targetRir" in patch ? { targetRir: patch.targetRir ?? null } : {}),
        ...("coachNote" in patch && patch.coachNote !== undefined
          ? { coachNote: patch.coachNote }
          : {}),
      }
      return syncSetsToTargetCount(merged)
    }),
  )
}

export async function updateSetPerformance(
  userId: string,
  workoutId: string,
  exerciseId: string,
  setIndex: number,
  patch: SetPerformancePatch,
): Promise<void> {
  await mutateExercises(userId, workoutId, (exercises) =>
    exercises.map((ex) => {
      if (ex.id !== exerciseId) return ex
      return {
        ...ex,
        sets: ex.sets.map((set) =>
          set.index !== setIndex
            ? set
            : {
                ...set,
                ...("performedReps" in patch
                  ? { performedReps: patch.performedReps ?? null }
                  : {}),
                ...("performedWeight" in patch
                  ? { performedWeight: patch.performedWeight ?? null }
                  : {}),
                ...("performedRir" in patch
                  ? { performedRir: patch.performedRir ?? null }
                  : {}),
                ...("clientNote" in patch && patch.clientNote !== undefined
                  ? { clientNote: patch.clientNote }
                  : {}),
                ...("hasVideo" in patch && patch.hasVideo !== undefined
                  ? { hasVideo: patch.hasVideo }
                  : {}),
              },
        ),
      }
    }),
  )
}

export async function addExercise(
  userId: string,
  workoutId: string,
  exercise: Omit<WorkoutExercise, "order" | "sets"> & {
    order?: number
    sets?: WorkoutSet[]
  },
): Promise<void> {
  await mutateExercises(userId, workoutId, (exercises) => {
    const nextOrder = exercise.order ?? exercises.length
    const base: WorkoutExercise = {
      id: exercise.id,
      order: nextOrder,
      name: exercise.name,
      targetSets: exercise.targetSets,
      targetRepRange: exercise.targetRepRange,
      targetWeight: exercise.targetWeight,
      targetRir: exercise.targetRir,
      coachNote: exercise.coachNote,
      sets: exercise.sets ?? [],
    }
    return [...exercises, syncSetsToTargetCount(base)]
  })
}

export async function removeExercise(
  userId: string,
  workoutId: string,
  exerciseId: string,
): Promise<void> {
  await mutateExercises(userId, workoutId, (exercises) =>
    exercises
      .filter((ex) => ex.id !== exerciseId)
      .map((ex, idx) => ({ ...ex, order: idx })),
  )
}
