"use client"

import { useEffect, useState } from "react"
import { subscribeWorkoutsInRange } from "./firebase-training"
import type { Workout } from "./types"

export type WorkoutsLoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; workouts: Workout[] }

/**
 * Subscribes to all workouts owned by `userId` whose `date` falls within
 * [fromYmd, toYmd]. Reconnects whenever the range or user changes.
 */
export function useWorkoutsInRange(
  userId: string | null,
  fromYmd: string,
  toYmd: string,
): WorkoutsLoadState {
  const [state, setState] = useState<WorkoutsLoadState>({ status: "loading" })

  useEffect(() => {
    if (!userId) {
      setState({ status: "loading" })
      return
    }
    setState({ status: "loading" })
    const unsubscribe = subscribeWorkoutsInRange(
      userId,
      fromYmd,
      toYmd,
      (workouts) => setState({ status: "ready", workouts }),
      (err) =>
        setState({
          status: "error",
          message: err.message || "Nem sikerült betölteni az edzéseket.",
        }),
    )
    return () => {
      unsubscribe()
    }
  }, [userId, fromYmd, toYmd])

  return state
}
