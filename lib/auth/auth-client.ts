import { FirebaseAuthClient } from "./firebase-auth-client"
import type { AuthClient } from "./types"

/**
 * Single source of truth for the active auth client.
 *
 * Backed by Firebase Authentication (email/password) plus a Firestore
 * `users/{uid}` document that stores the role and displayName. To swap
 * providers, replace this instance with another class that implements the
 * `AuthClient` contract — no other file in the codebase needs to change.
 */
export const authClient: AuthClient = new FirebaseAuthClient()
