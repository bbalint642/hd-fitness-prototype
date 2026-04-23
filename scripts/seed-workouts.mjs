#!/usr/bin/env node
/**
 * Seed one sample workout per client user into Firestore.
 *
 * Usage:
 *   FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccount.json \
 *   SEED_CLIENT_IDS=uid1,uid2 \
 *   SEED_WORKOUT_DATE=2026-04-23 \
 *   pnpm seed:workouts
 *
 * Env vars:
 *   FIREBASE_SERVICE_ACCOUNT_PATH  - absolute or relative path to the Firebase
 *                                    Admin SDK service account JSON (required,
 *                                    unless GOOGLE_APPLICATION_CREDENTIALS is
 *                                    already set).
 *   SEED_CLIENT_IDS                - comma-separated Firebase Auth UIDs of
 *                                    client users to seed. If omitted, the
 *                                    script discovers all users with
 *                                    role == "client".
 *   SEED_WORKOUT_DATE              - YYYY-MM-DD for the seeded workout's date.
 *                                    Defaults to today (local time of the
 *                                    machine running the script).
 *   FIREBASE_PROJECT_ID            - only needed when using
 *                                    GOOGLE_APPLICATION_CREDENTIALS; otherwise
 *                                    read from the service account JSON.
 */

import { readFile } from "node:fs/promises"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { cert, initializeApp, applicationDefault } from "firebase-admin/app"
import { getFirestore, FieldValue } from "firebase-admin/firestore"

const __dirname = dirname(fileURLToPath(import.meta.url))

function toYyyyMmDd(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function buildSetsForExercise(exercise) {
  const count = Math.max(0, Math.floor(Number(exercise.targetSets) || 0))
  const sets = []
  for (let i = 0; i < count; i++) {
    sets.push({
      index: i + 1,
      performedReps: null,
      performedWeight: null,
      performedRir: null,
      clientNote: "",
      hasVideo: false,
    })
  }
  return sets
}

async function loadTemplate() {
  const templatePath = resolve(__dirname, "seed", "sample-workout.json")
  const raw = await readFile(templatePath, "utf8")
  const template = JSON.parse(raw)
  return {
    dayTitle: template.dayTitle ?? "",
    weightUnit: template.weightUnit ?? "kg",
    exercises: (template.exercises ?? []).map((ex, idx) => ({
      id: ex.id ?? `ex-${idx + 1}`,
      order: typeof ex.order === "number" ? ex.order : idx,
      name: ex.name ?? "",
      targetSets: Number(ex.targetSets) || 0,
      targetRepRange: ex.targetRepRange ?? "",
      targetWeight: ex.targetWeight ?? null,
      targetRir: ex.targetRir ?? null,
      coachNote: ex.coachNote ?? "",
      sets: buildSetsForExercise(ex),
    })),
  }
}

async function initFirebase() {
  const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  if (saPath) {
    const resolved = resolve(process.cwd(), saPath)
    const raw = await readFile(resolved, "utf8")
    const credentials = JSON.parse(raw)
    initializeApp({ credential: cert(credentials) })
    return
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initializeApp({
      credential: applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
    return
  }
  throw new Error(
    "Missing credentials: set FIREBASE_SERVICE_ACCOUNT_PATH (path to a service account JSON) or GOOGLE_APPLICATION_CREDENTIALS.",
  )
}

async function resolveClientIds(db) {
  const explicit = process.env.SEED_CLIENT_IDS
  if (explicit) {
    return explicit
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  }
  const snap = await db.collection("users").where("role", "==", "client").get()
  const ids = []
  snap.forEach((doc) => ids.push(doc.id))
  return ids
}

async function seedForUser(db, userId, date, template) {
  const workoutId = `workout-${date}`
  const ref = db.collection("users").doc(userId).collection("workouts").doc(workoutId)
  await ref.set(
    {
      date,
      dayTitle: template.dayTitle,
      weightUnit: template.weightUnit,
      exercises: template.exercises,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: false },
  )
  return `users/${userId}/workouts/${workoutId}`
}

async function main() {
  await initFirebase()
  const db = getFirestore()

  const date = process.env.SEED_WORKOUT_DATE || toYyyyMmDd(new Date())
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(
      `SEED_WORKOUT_DATE must be YYYY-MM-DD (got "${date}").`,
    )
  }

  const template = await loadTemplate()
  const userIds = await resolveClientIds(db)

  if (userIds.length === 0) {
    console.warn(
      "No client users found. Set SEED_CLIENT_IDS or ensure users with role=='client' exist.",
    )
    return
  }

  console.log(
    `Seeding ${userIds.length} client(s) for date ${date} (weightUnit=${template.weightUnit}, ${template.exercises.length} exercises)...`,
  )
  for (const uid of userIds) {
    try {
      const path = await seedForUser(db, uid, date, template)
      console.log(`  ✓ ${path}`)
    } catch (err) {
      console.error(`  ✗ ${uid}:`, err?.message || err)
    }
  }
  console.log("Done.")
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
