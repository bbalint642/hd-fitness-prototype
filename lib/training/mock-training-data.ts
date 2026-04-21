import type { TrainingPlan } from "./types"

/**
 * Seed plan shown when a client first opens the training view. Each user gets
 * their own deep-cloned copy so edits never bleed between accounts. Values
 * follow the reference layout (1. hét, 1. nap) from the spreadsheet mock-up.
 */
export function seedTrainingPlan(userId: string): TrainingPlan {
  return {
    userId,
    weeks: [
      {
        id: "week-1",
        title: "1. hét",
        dateRange: "Április 13. – 19.",
        days: [
          {
            id: "day-1",
            title: "1. nap",
            exercises: [
              {
                id: "ex-1",
                name: "Fekvenyomás egykezesekkel egyenes padon",
                coachNote: "",
                clientNote: "",
                videoNote: "X",
                rows: [
                  {
                    id: "ex-1-r1",
                    setsCount: 2,
                    repRange: "5-8",
                    series1: { reps: 9, weight: 32.5, rir: 0 },
                    series2: { reps: 10, weight: 30, rir: 0 },
                  },
                  {
                    id: "ex-1-r2",
                    setsCount: 1,
                    repRange: "7-10",
                    series1: { reps: 8, weight: 27.5, rir: 0 },
                    series2: { reps: null, weight: null, rir: null },
                  },
                ],
              },
              {
                id: "ex-2",
                name: "Egyenes gépen nyomás",
                coachNote: "",
                clientNote: "",
                videoNote: "",
                rows: [
                  {
                    id: "ex-2-r1",
                    setsCount: 2,
                    repRange: "7-10",
                    series1: { reps: 10, weight: 64, rir: 0 },
                    series2: { reps: 8, weight: 57, rir: 0 },
                  },
                ],
              },
              {
                id: "ex-3",
                name: "Tárogatás gépen",
                coachNote: "",
                clientNote: "",
                videoNote: "",
                rows: [
                  {
                    id: "ex-3-r1",
                    setsCount: 2,
                    repRange: "8-12",
                    series1: { reps: 7, weight: 68, rir: 0 },
                    series2: { reps: 8, weight: 61, rir: 0 },
                  },
                  {
                    id: "ex-3-r2",
                    setsCount: 2,
                    repRange: "7-10",
                    series1: { reps: 8, weight: 30, rir: 0 },
                    series2: { reps: 9, weight: 25, rir: 0 },
                  },
                ],
              },
              {
                id: "ex-4",
                name: "Tricepsz letolás hosszú kötéllel",
                coachNote: "",
                clientNote: "",
                videoNote: "",
                rows: [
                  {
                    id: "ex-4-r1",
                    setsCount: 2,
                    repRange: "10-13",
                    series1: { reps: 11, weight: 25, rir: 0 },
                    series2: { reps: null, weight: null, rir: null },
                  },
                  {
                    id: "ex-4-r2",
                    setsCount: 1,
                    repRange: "6-10",
                    series1: { reps: 13, weight: 12.5, rir: 0 },
                    series2: { reps: 9, weight: 11, rir: 0 },
                  },
                ],
              },
              {
                id: "ex-5",
                name: "Oldalemelés egykezesekkel",
                coachNote: "",
                clientNote: "",
                videoNote: "",
                rows: [
                  {
                    id: "ex-5-r1",
                    setsCount: 2,
                    repRange: "10-14",
                    series1: { reps: 8, weight: 10, rir: 0 },
                    series2: { reps: null, weight: null, rir: null },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
}
