import {
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/firebase-app"
import {
  AuthClient,
  AuthError,
  AuthStateListener,
  AuthUser,
  UserRole,
} from "./types"

interface UserDocData {
  role?: UserRole
  displayName?: string
  username?: string
}

/**
 * Fetches the user profile (role + displayName) from the Firestore
 * `users/{uid}` document. Required for every signed-in user; if the document
 * is missing or malformed we treat the account as invalid.
 */
async function loadUserProfile(fbUser: FirebaseUser): Promise<AuthUser> {
  const db = getFirebaseDb()
  const snap = await getDoc(doc(db, "users", fbUser.uid))
  if (!snap.exists()) {
    throw new AuthError(
      "A fiók nem található a rendszerben. Lépj kapcsolatba a coach-csal.",
    )
  }
  const data = snap.data() as UserDocData
  if (data.role !== "coach" && data.role !== "client") {
    throw new AuthError("A fiók szerepe érvénytelen.")
  }
  return {
    id: fbUser.uid,
    username: data.username ?? fbUser.email ?? fbUser.uid,
    displayName: data.displayName ?? fbUser.displayName ?? fbUser.email ?? "",
    role: data.role,
  }
}

function mapFirebaseAuthError(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "Érvénytelen email cím."
    case "auth/user-disabled":
      return "Ez a fiók le van tiltva."
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Hibás email vagy jelszó."
    case "auth/too-many-requests":
      return "Túl sok próbálkozás. Kérlek, próbáld később."
    case "auth/network-request-failed":
      return "Hálózati hiba. Ellenőrizd a kapcsolatot."
    default:
      return "Bejelentkezés sikertelen. Próbáld újra."
  }
}

export class FirebaseAuthClient implements AuthClient {
  private listeners = new Set<AuthStateListener>()
  private currentUser: AuthUser | null = null
  private initialized = false

  constructor() {
    if (typeof window === "undefined") return

    firebaseOnAuthStateChanged(getFirebaseAuth(), async (fbUser) => {
      if (!fbUser) {
        this.currentUser = null
        this.initialized = true
        this.emit()
        return
      }
      try {
        this.currentUser = await loadUserProfile(fbUser)
      } catch (err) {
        console.error("Failed to load user profile from Firestore:", err)
        this.currentUser = null
        try {
          await signOut(getFirebaseAuth())
        } catch {
          // ignore
        }
      }
      this.initialized = true
      this.emit()
    })
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser
  }

  async login(email: string, password: string): Promise<AuthUser> {
    try {
      const credential = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email.trim(),
        password,
      )
      const profile = await loadUserProfile(credential.user)
      this.currentUser = profile
      this.emit()
      return profile
    } catch (err: unknown) {
      if (err instanceof AuthError) throw err
      const code =
        typeof err === "object" && err !== null && "code" in err
          ? String((err as { code: unknown }).code)
          : ""
      throw new AuthError(mapFirebaseAuthError(code))
    }
  }

  async logout(): Promise<void> {
    await signOut(getFirebaseAuth())
    this.currentUser = null
    this.emit()
  }

  onAuthStateChanged(listener: AuthStateListener): () => void {
    this.listeners.add(listener)
    if (this.initialized || typeof window === "undefined") {
      listener(this.currentUser)
    }
    return () => {
      this.listeners.delete(listener)
    }
  }

  private emit(): void {
    for (const listener of this.listeners) {
      listener(this.currentUser)
    }
  }
}
