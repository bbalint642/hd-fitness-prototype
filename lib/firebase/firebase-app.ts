import { getApps, initializeApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"

function readConfig() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }

  const missing = (
    ["apiKey", "authDomain", "projectId", "appId"] as const
  ).filter((key) => !config[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase env vars: ${missing
        .map((key) => `NEXT_PUBLIC_FIREBASE_${key.replace(/[A-Z]/g, (c) => `_${c}`).toUpperCase()}`)
        .join(", ")}. Copy .env.example to .env.local and fill them in.`,
    )
  }

  return config as {
    apiKey: string
    authDomain: string
    projectId: string
    storageBucket?: string
    messagingSenderId?: string
    appId: string
    measurementId?: string
  }
}

let appInstance: FirebaseApp | null = null
let authInstance: Auth | null = null
let dbInstance: Firestore | null = null

export function getFirebaseApp(): FirebaseApp {
  if (appInstance) return appInstance
  const existing = getApps()[0]
  appInstance = existing ?? initializeApp(readConfig())
  return appInstance
}

export function getFirebaseAuth(): Auth {
  if (authInstance) return authInstance
  authInstance = getAuth(getFirebaseApp())
  return authInstance
}

export function getFirebaseDb(): Firestore {
  if (dbInstance) return dbInstance
  dbInstance = getFirestore(getFirebaseApp())
  return dbInstance
}
