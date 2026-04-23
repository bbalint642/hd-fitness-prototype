"use client"

import { Fragment, useState } from "react"
import {
  Check,
  ChevronDown,
  Clapperboard,
  Dumbbell,
  MessageSquareText,
  NotebookPen,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  updateExerciseName,
  updateExercisePrescription,
  updateSetPerformance,
} from "@/lib/training/firebase-training"
import type {
  Workout,
  WorkoutExercise,
  WorkoutSet,
} from "@/lib/training/types"
import { formatDayLabelHu, parseYyyyMmDd } from "@/lib/training/date-utils"

export type TrainingMode = "client" | "coach"

/* --------------------------- Shared style tokens -------------------------- */

const headerMainClass =
  "bg-primary text-primary-foreground font-semibold border border-primary/80"

const headerSubClass =
  "bg-primary/90 text-primary-foreground border border-primary/40 font-medium"

const cellReadOnlySurface = "bg-card/60 text-foreground"
const cellEditableSurface = "bg-input/35 text-foreground"

/* ------------------------------- Public API ------------------------------- */

interface WorkoutDayViewProps {
  workout: Workout
  /** `client` (default): only per-set performance + client note + hasVideo
   *  are editable. `coach`: every field is editable. */
  mode?: TrainingMode
}

/**
 * Renders a single workout day. Responsive: desktop keeps the dense
 * spreadsheet-style table, mobile collapses to a stacked card view.
 * Both share the same Firestore mutators, so edits sync in realtime via
 * the page-level subscription.
 */
export function WorkoutDayView(props: WorkoutDayViewProps) {
  return (
    <>
      <div className="hidden md:block">
        <WorkoutDayDesktop {...props} />
      </div>
      <div className="md:hidden">
        <WorkoutDayMobile {...props} />
      </div>
    </>
  )
}

/* ============================================================================
 * Desktop table view
 * ========================================================================= */

function WorkoutDayDesktop({ workout, mode = "client" }: WorkoutDayViewProps) {
  const dayDate = workout.date ? parseYyyyMmDd(workout.date) : null
  const dayTitle = workout.dayTitle || (dayDate ? formatDayLabelHu(dayDate) : "Edzés")

  return (
    <Card className="border-border bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-serif text-xl uppercase tracking-wide">
          {dayTitle}
        </CardTitle>
        <CardDescription>
          {workout.date}
          {workout.exercises.length > 0
            ? ` · ${workout.exercises.length} gyakorlat`
            : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {workout.exercises.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ehhez a naphoz nincs rögzített gyakorlat.
          </p>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-primary/40">
                  <TableHead
                    rowSpan={2}
                    className={cn("min-w-[220px] align-middle", headerMainClass)}
                  >
                    Gyakorlat
                  </TableHead>
                  <TableHead
                    colSpan={4}
                    className={cn(
                      "text-center uppercase tracking-wider text-[11px] border-l border-primary/60",
                      headerMainClass,
                    )}
                  >
                    Előírás
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className={cn(
                      "w-14 text-center align-middle border-l border-primary/60",
                      headerMainClass,
                    )}
                  >
                    Szett
                  </TableHead>
                  <TableHead
                    colSpan={3}
                    className={cn(
                      "text-center uppercase tracking-wider text-[11px] border-l border-primary/60",
                      headerMainClass,
                    )}
                  >
                    Teljesítés
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className={cn(
                      "min-w-[160px] align-middle border-l border-primary/60",
                      headerMainClass,
                    )}
                  >
                    Coach jegyzet
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className={cn(
                      "min-w-[180px] align-middle border-l border-primary/60",
                      headerMainClass,
                    )}
                  >
                    Saját jegyzet
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className={cn(
                      "w-16 text-center align-middle border-l border-primary/60",
                      headerMainClass,
                    )}
                  >
                    Videó
                  </TableHead>
                </TableRow>
                <TableRow className="hover:bg-transparent border-b border-primary/40">
                  <TableHead
                    className={cn(
                      "w-14 border-l border-primary/60 text-center text-[11px]",
                      headerSubClass,
                    )}
                  >
                    Sor.
                  </TableHead>
                  <TableHead
                    className={cn("w-20 text-center text-[11px]", headerSubClass)}
                  >
                    Ism.
                  </TableHead>
                  <TableHead
                    className={cn("w-20 text-center text-[11px]", headerSubClass)}
                  >
                    Súly
                  </TableHead>
                  <TableHead
                    className={cn("w-14 text-center text-[11px]", headerSubClass)}
                  >
                    RIR
                  </TableHead>
                  <TableHead
                    className={cn(
                      "w-16 border-l border-primary/60 text-center text-[11px]",
                      headerSubClass,
                    )}
                  >
                    Ism.
                  </TableHead>
                  <TableHead
                    className={cn("w-20 text-center text-[11px]", headerSubClass)}
                  >
                    Súly
                  </TableHead>
                  <TableHead
                    className={cn("w-14 text-center text-[11px]", headerSubClass)}
                  >
                    RIR
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workout.exercises.map((exercise) => (
                  <ExerciseSetRows
                    key={exercise.id}
                    userId={workout.userId}
                    workoutId={workout.id}
                    exercise={exercise}
                    weightUnit={workout.weightUnit}
                    mode={mode}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ExerciseSetRows({
  userId,
  workoutId,
  exercise,
  weightUnit,
  mode,
}: {
  userId: string
  workoutId: string
  exercise: WorkoutExercise
  weightUnit: string
  mode: TrainingMode
}) {
  const isCoach = mode === "coach"
  const coachEditableSurface = isCoach ? cellEditableSurface : cellReadOnlySurface
  const rowCount = Math.max(1, exercise.sets.length)

  return (
    <Fragment>
      {exercise.sets.map((set, idx) => {
        const isFirst = idx === 0
        const isLast = idx === exercise.sets.length - 1

        return (
          <TableRow
            key={`${exercise.id}-${set.index}`}
            className={cn(
              "border-b border-border/60 transition-colors",
              "hover:bg-primary/[0.03]",
              !isLast && "border-b-border/40",
              isLast && "border-b-2 border-b-border",
            )}
          >
            {isFirst && (
              <>
                <TableCell
                  rowSpan={rowCount}
                  className={cn(
                    "align-top whitespace-normal font-medium",
                    isCoach ? "p-1" : "",
                    coachEditableSurface,
                  )}
                >
                  {isCoach ? (
                    <EditableText
                      value={exercise.name}
                      onChange={(v) =>
                        updateExerciseName(userId, workoutId, exercise.id, v)
                      }
                      placeholder="Gyakorlat neve…"
                    />
                  ) : (
                    exercise.name || "–"
                  )}
                </TableCell>

                <TableCell
                  rowSpan={rowCount}
                  className={cn(
                    "text-center tabular-nums border-l border-border/40",
                    isCoach ? "p-1" : "px-2 py-2",
                    coachEditableSurface,
                  )}
                >
                  {isCoach ? (
                    <EditableNumber
                      value={exercise.targetSets}
                      onChange={(v) =>
                        updateExercisePrescription(userId, workoutId, exercise.id, {
                          targetSets: Math.max(0, Math.floor(v ?? 0)),
                        })
                      }
                      className="text-center"
                    />
                  ) : (
                    exercise.targetSets
                  )}
                </TableCell>

                <TableCell
                  rowSpan={rowCount}
                  className={cn(
                    "text-center border-l border-border/40",
                    isCoach ? "p-1" : "px-2 py-2",
                    coachEditableSurface,
                  )}
                >
                  {isCoach ? (
                    <EditableText
                      value={exercise.targetRepRange}
                      onChange={(v) =>
                        updateExercisePrescription(userId, workoutId, exercise.id, {
                          targetRepRange: v,
                        })
                      }
                      placeholder="–"
                      className="text-center"
                    />
                  ) : (
                    exercise.targetRepRange || "–"
                  )}
                </TableCell>

                <TableCell
                  rowSpan={rowCount}
                  className={cn(
                    "text-center tabular-nums border-l border-border/40",
                    isCoach ? "p-1" : "px-2 py-2",
                    coachEditableSurface,
                  )}
                >
                  {isCoach ? (
                    <EditableNumber
                      value={exercise.targetWeight}
                      step={0.5}
                      onChange={(v) =>
                        updateExercisePrescription(userId, workoutId, exercise.id, {
                          targetWeight: v,
                        })
                      }
                      className="text-center"
                    />
                  ) : exercise.targetWeight === null ? (
                    "–"
                  ) : (
                    `${exercise.targetWeight} ${weightUnit}`
                  )}
                </TableCell>

                <TableCell
                  rowSpan={rowCount}
                  className={cn(
                    "text-center tabular-nums border-l border-border/40",
                    isCoach ? "p-1" : "px-2 py-2",
                    coachEditableSurface,
                  )}
                >
                  {isCoach ? (
                    <EditableNumber
                      value={exercise.targetRir}
                      onChange={(v) =>
                        updateExercisePrescription(userId, workoutId, exercise.id, {
                          targetRir: v,
                        })
                      }
                      className="text-center"
                    />
                  ) : (
                    (exercise.targetRir ?? "–")
                  )}
                </TableCell>
              </>
            )}

            <TableCell
              className={cn(
                "text-center tabular-nums font-medium text-muted-foreground border-l border-border/40",
                "px-2 py-2",
              )}
            >
              {set.index}.
            </TableCell>

            <PerformanceCells
              userId={userId}
              workoutId={workoutId}
              exerciseId={exercise.id}
              set={set}
            />

            {isFirst && (
              <>
                <TableCell
                  rowSpan={rowCount}
                  className={cn(
                    "align-top text-sm leading-snug border-l border-border/40",
                    isCoach ? "p-1" : "px-2 py-2",
                    coachEditableSurface,
                  )}
                >
                  {isCoach ? (
                    <EditableTextarea
                      value={exercise.coachNote}
                      onChange={(v) =>
                        updateExercisePrescription(userId, workoutId, exercise.id, {
                          coachNote: v,
                        })
                      }
                      placeholder="Coach megjegyzés…"
                    />
                  ) : exercise.coachNote.trim() ? (
                    <span className="whitespace-pre-wrap">{exercise.coachNote}</span>
                  ) : (
                    "–"
                  )}
                </TableCell>
              </>
            )}

            <TableCell
              className={cn(
                "align-top p-1 border-l border-border/40",
                cellEditableSurface,
              )}
            >
              <EditableTextarea
                value={set.clientNote}
                onChange={(v) =>
                  updateSetPerformance(userId, workoutId, exercise.id, set.index, {
                    clientNote: v,
                  })
                }
                placeholder="Saját megjegyzés…"
              />
            </TableCell>

            <TableCell
              className={cn(
                "text-center border-l border-border/40",
                cellEditableSurface,
                "px-2 py-2",
              )}
            >
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={set.hasVideo}
                  onCheckedChange={(checked) =>
                    updateSetPerformance(userId, workoutId, exercise.id, set.index, {
                      hasVideo: checked === true,
                    })
                  }
                  aria-label={`Videó a ${set.index}. szettről`}
                />
              </div>
            </TableCell>
          </TableRow>
        )
      })}
    </Fragment>
  )
}

function PerformanceCells({
  userId,
  workoutId,
  exerciseId,
  set,
}: {
  userId: string
  workoutId: string
  exerciseId: string
  set: WorkoutSet
}) {
  const setField = (patch: Partial<WorkoutSet>) =>
    updateSetPerformance(userId, workoutId, exerciseId, set.index, patch)

  return (
    <>
      <TableCell
        className={cn(
          "p-1 text-center border-l border-border/60",
          cellEditableSurface,
        )}
      >
        <EditableNumber
          value={set.performedReps}
          onChange={(v) => setField({ performedReps: v })}
          className="text-center"
        />
      </TableCell>
      <TableCell className={cn("p-1 text-center", cellEditableSurface)}>
        <EditableNumber
          value={set.performedWeight}
          onChange={(v) => setField({ performedWeight: v })}
          step={0.5}
          className="text-center"
        />
      </TableCell>
      <TableCell className={cn("p-1 text-center", cellEditableSurface)}>
        <EditableNumber
          value={set.performedRir}
          onChange={(v) => setField({ performedRir: v })}
          className="text-center"
        />
      </TableCell>
    </>
  )
}

/* ============================================================================
 * Mobile stacked view
 * ========================================================================= */

function WorkoutDayMobile({ workout, mode = "client" }: WorkoutDayViewProps) {
  const dayDate = workout.date ? parseYyyyMmDd(workout.date) : null
  const dayTitle = workout.dayTitle || (dayDate ? formatDayLabelHu(dayDate) : "Edzés")

  return (
    <section className="space-y-4">
      <header className="space-y-1 px-1">
        <h2 className="font-serif text-xl font-bold uppercase tracking-wide text-foreground">
          {dayTitle}
        </h2>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {workout.date}
          {workout.exercises.length > 0
            ? ` · ${workout.exercises.length} gyakorlat`
            : ""}
        </p>
      </header>

      {workout.exercises.length === 0 ? (
        <p className="px-1 text-sm text-muted-foreground">
          Ehhez a naphoz nincs rögzített gyakorlat.
        </p>
      ) : (
        <ul className="space-y-4">
          {workout.exercises.map((exercise, idx) => (
            <li key={exercise.id}>
              <MobileExerciseCard
                userId={workout.userId}
                workoutId={workout.id}
                exercise={exercise}
                weightUnit={workout.weightUnit}
                index={idx + 1}
                mode={mode}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function MobileExerciseCard({
  userId,
  workoutId,
  exercise,
  weightUnit,
  index,
  mode,
}: {
  userId: string
  workoutId: string
  exercise: WorkoutExercise
  weightUnit: string
  index: number
  mode: TrainingMode
}) {
  const isCoach = mode === "coach"
  const completedSets = exercise.sets.reduce(
    (acc, set) => acc + (isSetComplete(set) ? 1 : 0),
    0,
  )
  const hasCoachNote = exercise.coachNote.trim().length > 0

  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-card/80 backdrop-blur-sm",
        "shadow-sm overflow-hidden",
      )}
    >
      <header
        className={cn(
          "flex items-start gap-3 border-b border-border px-4 py-3",
          "bg-gradient-to-r from-card to-card/60",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            "bg-primary/15 text-primary ring-1 ring-primary/30",
            "font-serif text-sm font-bold",
          )}
        >
          {index}
        </span>
        <div className="min-w-0 flex-1">
          {isCoach ? (
            <EditableText
              value={exercise.name}
              onChange={(v) => updateExerciseName(userId, workoutId, exercise.id, v)}
              placeholder="Gyakorlat neve…"
              className="!px-2 !py-1 text-base font-semibold leading-tight"
            />
          ) : (
            <h4 className="text-base font-semibold leading-tight text-foreground">
              {exercise.name || "–"}
            </h4>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Dumbbell className="h-3 w-3" aria-hidden />
              {completedSets}/{exercise.targetSets || "–"} szett
            </span>
            <span>Cél zóna: {exercise.targetRepRange || "–"} ism.</span>
            <span>
              {exercise.targetWeight === null
                ? "–"
                : `${exercise.targetWeight} ${weightUnit}`}
            </span>
            <span>RIR {exercise.targetRir ?? "–"}</span>
          </div>
        </div>
      </header>

      {isCoach && (
        <div className="grid grid-cols-2 gap-2 border-b border-border/80 px-4 py-3 md:grid-cols-4">
          <LabeledField label="Szettek">
            <EditableNumber
              value={exercise.targetSets}
              onChange={(v) =>
                updateExercisePrescription(userId, workoutId, exercise.id, {
                  targetSets: Math.max(0, Math.floor(v ?? 0)),
                })
              }
              className="text-center"
            />
          </LabeledField>
          <LabeledField label="Ism. tart.">
            <EditableText
              value={exercise.targetRepRange}
              onChange={(v) =>
                updateExercisePrescription(userId, workoutId, exercise.id, {
                  targetRepRange: v,
                })
              }
              placeholder="6-9"
              className="text-center"
            />
          </LabeledField>
          <LabeledField label={`Súly (${weightUnit})`}>
            <EditableNumber
              value={exercise.targetWeight}
              step={0.5}
              onChange={(v) =>
                updateExercisePrescription(userId, workoutId, exercise.id, {
                  targetWeight: v,
                })
              }
              className="text-center"
            />
          </LabeledField>
          <LabeledField label="Cél RIR">
            <EditableNumber
              value={exercise.targetRir}
              onChange={(v) =>
                updateExercisePrescription(userId, workoutId, exercise.id, {
                  targetRir: v,
                })
              }
              className="text-center"
            />
          </LabeledField>
        </div>
      )}

      <div className="divide-y divide-border/60">
        {exercise.sets.map((set) => (
          <MobileSetBlock
            key={set.index}
            userId={userId}
            workoutId={workoutId}
            exerciseId={exercise.id}
            set={set}
            weightUnit={weightUnit}
          />
        ))}
      </div>

      <MobileNotesSection
        userId={userId}
        workoutId={workoutId}
        exercise={exercise}
        isCoach={isCoach}
        defaultOpen={hasCoachNote || isCoach}
      />
    </article>
  )
}

function MobileSetBlock({
  userId,
  workoutId,
  exerciseId,
  set,
  weightUnit,
}: {
  userId: string
  workoutId: string
  exerciseId: string
  set: WorkoutSet
  weightUnit: string
}) {
  const complete = isSetComplete(set)
  const empty =
    set.performedReps === null &&
    set.performedWeight === null &&
    set.performedRir === null

  const setField = (patch: Partial<WorkoutSet>) =>
    updateSetPerformance(userId, workoutId, exerciseId, set.index, patch)

  return (
    <div
      className={cn(
        "space-y-3 px-4 py-4 transition-colors",
        complete && "bg-primary/[0.04]",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider">
          <span
            className={cn(
              "font-semibold",
              complete ? "text-primary" : "text-foreground",
            )}
          >
            {set.index}. szett
          </span>
          {complete && (
            <Check className="h-3.5 w-3.5 text-primary" aria-label="Kész" />
          )}
          {empty && (
            <span className="text-muted-foreground">még nincs rögzítve</span>
          )}
        </div>
        <label className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          <Clapperboard className="h-3.5 w-3.5" aria-hidden />
          Videó
          <Checkbox
            checked={set.hasVideo}
            onCheckedChange={(checked) =>
              setField({ hasVideo: checked === true })
            }
            aria-label={`Videó a ${set.index}. szettről`}
          />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <MobilePerfField
          label="Ism."
          value={set.performedReps}
          onChange={(v) => setField({ performedReps: v })}
        />
        <MobilePerfField
          label="Súly"
          unit={weightUnit}
          step={0.5}
          value={set.performedWeight}
          onChange={(v) => setField({ performedWeight: v })}
        />
        <MobilePerfField
          label="RIR"
          value={set.performedRir}
          onChange={(v) => setField({ performedRir: v })}
        />
      </div>

      <label className="block">
        <span className="mb-1 block text-[11px] uppercase tracking-wider text-muted-foreground">
          Szett jegyzet
        </span>
        <EditableTextarea
          value={set.clientNote}
          onChange={(v) => setField({ clientNote: v })}
          placeholder="Mit tapasztaltál ezen a szetten?"
        />
      </label>
    </div>
  )
}

function MobilePerfField({
  label,
  unit,
  value,
  onChange,
  step = 1,
}: {
  label: string
  unit?: string
  value: number | null
  onChange: (value: number | null) => void
  step?: number
}) {
  return (
    <label className="flex flex-col gap-1 rounded-md bg-input/35 px-2 py-1.5">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
        {unit ? ` (${unit})` : ""}
      </span>
      <EditableNumber
        value={value}
        onChange={onChange}
        step={step}
        className={cn(
          "!bg-transparent text-right text-base font-semibold tabular-nums",
          "!px-1 !py-0 h-7 hover:!bg-transparent",
        )}
      />
    </label>
  )
}

function MobileNotesSection({
  userId,
  workoutId,
  exercise,
  isCoach,
  defaultOpen,
}: {
  userId: string
  workoutId: string
  exercise: WorkoutExercise
  isCoach: boolean
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const hasCoachNote = exercise.coachNote.trim().length > 0

  return (
    <details
      className="group border-t border-border/80"
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between px-4 py-3",
          "text-xs font-medium uppercase tracking-wider text-muted-foreground",
          "hover:text-foreground transition-colors",
          "[&::-webkit-details-marker]:hidden",
        )}
      >
        <span className="inline-flex items-center gap-2">
          <NotebookPen className="h-3.5 w-3.5" aria-hidden />
          Coach jegyzet
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            "group-open:rotate-180",
          )}
          aria-hidden
        />
      </summary>

      <div className="px-4 pb-4">
        <div className="rounded-lg border border-border/80 bg-card/40 p-3">
          <div className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <MessageSquareText className="h-3.5 w-3.5" />
            Coach jegyzet
          </div>
          {isCoach ? (
            <EditableTextarea
              value={exercise.coachNote}
              onChange={(v) =>
                updateExercisePrescription(userId, workoutId, exercise.id, {
                  coachNote: v,
                })
              }
              placeholder="Coach megjegyzés…"
            />
          ) : (
            <p
              className={cn(
                "whitespace-pre-wrap text-sm leading-snug",
                hasCoachNote ? "text-foreground" : "text-muted-foreground/70",
              )}
            >
              {hasCoachNote ? exercise.coachNote : "Nincs coach megjegyzés."}
            </p>
          )}
        </div>
      </div>
    </details>
  )
}

function LabeledField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1 rounded-md bg-input/35 px-2 py-1.5">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}

function isSetComplete(set: WorkoutSet): boolean {
  return (
    set.performedReps !== null &&
    set.performedWeight !== null &&
    set.performedRir !== null
  )
}

/* -------------------------- Editable cell inputs -------------------------- */

const cellInputBase = cn(
  "w-full bg-transparent text-sm text-foreground tabular-nums",
  "rounded-md border border-transparent px-2 py-1 transition-[background-color,border-color,box-shadow]",
  "hover:bg-input/60",
  "focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/25 focus:outline-none",
  "placeholder:text-muted-foreground/60",
)

function EditableNumber({
  value,
  onChange,
  step = 1,
  className,
  placeholder = "–",
}: {
  value: number | null
  onChange: (value: number | null) => void
  step?: number
  className?: string
  placeholder?: string
}) {
  const [draft, setDraft] = useState<string | null>(null)
  const displayed = draft ?? (value === null ? "" : String(value))

  return (
    <input
      type="number"
      inputMode="decimal"
      step={step}
      value={displayed}
      placeholder={placeholder}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        if (draft === null) return
        const raw = draft.trim()
        setDraft(null)
        if (raw === "") {
          if (value !== null) onChange(null)
          return
        }
        const parsed = Number(raw)
        if (Number.isNaN(parsed)) {
          if (value !== null) onChange(null)
          return
        }
        if (parsed !== value) onChange(parsed)
      }}
      className={cn(
        cellInputBase,
        "[-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        className,
      )}
    />
  )
}

function EditableText({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}) {
  const [draft, setDraft] = useState<string | null>(null)
  const displayed = draft ?? value

  return (
    <input
      type="text"
      value={displayed}
      placeholder={placeholder}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        if (draft === null) return
        const next = draft
        setDraft(null)
        if (next !== value) onChange(next)
      }}
      className={cn(cellInputBase, "text-foreground", className)}
    />
  )
}

function EditableTextarea({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [draft, setDraft] = useState<string | null>(null)
  const displayed = draft ?? value

  return (
    <textarea
      value={displayed}
      placeholder={placeholder}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        if (draft === null) return
        const next = draft
        setDraft(null)
        if (next !== value) onChange(next)
      }}
      rows={2}
      className={cn(cellInputBase, "resize-y min-h-[36px] leading-snug")}
    />
  )
}
