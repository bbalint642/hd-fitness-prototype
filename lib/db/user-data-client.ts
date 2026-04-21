import { MockUserDataClient } from "./mock-user-data-client"
import type { UserDataClient } from "./types"

/**
 * Single source of truth for the active user data client.
 *
 * Replace with a `FirestoreUserDataClient` that reads/writes Firestore
 * collections. The `AuthClient` and `UserDataClient` are intentionally
 * separate so that authentication (Firebase Auth) and application data
 * (Firestore) live in independent stores.
 */
export const userDataClient: UserDataClient = new MockUserDataClient()
