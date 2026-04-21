import type {
  BodyWeightEntry,
  CalorieEntry,
  UserAppData,
  UserDataClient,
  UserProfile,
  WorkoutEntry,
} from "./types"

const emptyAppData = (): UserAppData => ({
  bodyWeight: [],
  calories: [],
  workouts: [],
})

/**
 * In-memory mock implementation. State is cleared on page reload, which is
 * fine for the current scaffolding. Swap for a FirestoreUserDataClient once
 * Firebase is wired up.
 */
export class MockUserDataClient implements UserDataClient {
  private profiles = new Map<string, UserProfile>()
  private appData = new Map<string, UserAppData>()

  async getProfile(userId: string): Promise<UserProfile | null> {
    return this.profiles.get(userId) ?? null
  }

  async upsertProfile(profile: UserProfile): Promise<void> {
    this.profiles.set(profile.userId, profile)
  }

  async getAppData(userId: string): Promise<UserAppData> {
    return this.appData.get(userId) ?? emptyAppData()
  }

  async addBodyWeight(userId: string, entry: BodyWeightEntry): Promise<void> {
    const data = this.appData.get(userId) ?? emptyAppData()
    data.bodyWeight.push(entry)
    this.appData.set(userId, data)
  }

  async addCalories(userId: string, entry: CalorieEntry): Promise<void> {
    const data = this.appData.get(userId) ?? emptyAppData()
    data.calories.push(entry)
    this.appData.set(userId, data)
  }

  async addWorkout(userId: string, entry: WorkoutEntry): Promise<void> {
    const data = this.appData.get(userId) ?? emptyAppData()
    data.workouts.push(entry)
    this.appData.set(userId, data)
  }
}
