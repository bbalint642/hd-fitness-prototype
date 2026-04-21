import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase/firebase-app"
import type { AuthUser, UserRole } from "./types"

interface UserDocData {
  role?: UserRole
  displayName?: string
  username?: string
  email?: string
}

function toAuthUser(id: string, data: UserDocData): AuthUser | null {
  if (data.role !== "coach" && data.role !== "client") return null
  return {
    id,
    username: data.username ?? data.email ?? id,
    displayName: data.displayName ?? data.username ?? data.email ?? "",
    role: data.role,
  }
}

/**
 * Returns every user with `role == "client"` from the Firestore `users`
 * collection. The collection is expected to contain one document per user,
 * keyed by their Firebase Auth UID, with fields:
 *   - role: "coach" | "client"
 *   - displayName: string
 *   - username?: string
 *   - email?: string
 */
export async function getClientUsers(): Promise<AuthUser[]> {
  const db = getFirebaseDb()
  const q = query(
    collection(db, "users"),
    where("role", "==", "client"),
    orderBy("displayName"),
  )
  const snap = await getDocs(q)
  const users: AuthUser[] = []
  for (const d of snap.docs) {
    const user = toAuthUser(d.id, d.data() as UserDocData)
    if (user) users.push(user)
  }
  return users
}

export async function getClientById(id: string): Promise<AuthUser | null> {
  const db = getFirebaseDb()
  const snap = await getDoc(doc(db, "users", id))
  if (!snap.exists()) return null
  const user = toAuthUser(snap.id, snap.data() as UserDocData)
  if (!user || user.role !== "client") return null
  return user
}
