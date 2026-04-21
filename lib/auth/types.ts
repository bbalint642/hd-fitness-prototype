export type UserRole = "coach" | "client"

export interface AuthUser {
  id: string
  username: string
  displayName: string
  role: UserRole
}

export interface AuthSession {
  user: AuthUser
}

export type AuthStateListener = (user: AuthUser | null) => void

/**
 * Implementations currently wrap a hardcoded mock store. A later Firebase
 * implementation fulfills the same contract by calling
 * `signInWithEmailAndPassword`, `signOut`, and `onAuthStateChanged` under
 * the hood, plus reading the role from a `users` Firestore collection.
 */
export interface AuthClient {
  getCurrentUser(): AuthUser | null
  login(username: string, password: string): Promise<AuthUser>
  logout(): Promise<void>
  onAuthStateChanged(listener: AuthStateListener): () => void
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthError"
  }
}
