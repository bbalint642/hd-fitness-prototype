import type { UserRole } from "@/lib/auth/types"

/**
 * Profile data is metadata that supplements the authenticated user record.
 * Lives in its own collection in the eventual Firestore setup so that
 * profile edits never touch the auth record.
 */
export interface UserProfile {
  userId: string
  username: string
  displayName: string
  role: UserRole
  avatarUrl?: string
  createdAt: string
}

export interface BodyWeightEntry {
  date: string
  weightKg: number
}

export interface CalorieEntry {
  date: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
}

export interface WorkoutEntry {
  id: string
  date: string
  title: string
  durationMinutes: number
  notes?: string
}

/**
 * Grouped application data for a single user. In Firestore this translates to
 * a `users/{userId}/{collection}` structure, where each sub-array is its own
 * collection.
 */
export interface UserAppData {
  bodyWeight: BodyWeightEntry[]
  calories: CalorieEntry[]
  workouts: WorkoutEntry[]
}

/**
 * Contract for the user data store. A Firestore-backed implementation
 * satisfies this interface by querying the relevant user-scoped collections.
 */
export interface UserDataClient {
  getProfile(userId: string): Promise<UserProfile | null>
  upsertProfile(profile: UserProfile): Promise<void>

  getAppData(userId: string): Promise<UserAppData>

  addBodyWeight(userId: string, entry: BodyWeightEntry): Promise<void>
  addCalories(userId: string, entry: CalorieEntry): Promise<void>
  addWorkout(userId: string, entry: WorkoutEntry): Promise<void>
}
