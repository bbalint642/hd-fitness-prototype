"use client"

import { Fragment, useMemo, useState } from "react"
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
  updateExerciseNote,
  updateRowField,
  updateSeriesField,
} from "@/lib/training/training-store"
import type {
  ExerciseRow,
  SeriesEntry,
  SeriesField,
  SeriesSlot,
  TrainingDay,
  TrainingExercise,
  TrainingWeek,
} from "@/lib/training/types"

export type TrainingMode = "client" | "coach"

/* --------------------------- Shared style tokens -------------------------- */

/** Fő fejléc: teljes primary (var(--primary) / accent arany) */
const headerMainClass =
  "bg-primary text-primary-foreground font-semibold border border-primary/80"

/** Sorozat alfejléc (Ism. / Súly / RIR): primary 50% átlátszósággal */
const headerSubClass =
  "bg-primary/90 text-primary-foreground border border-primary/40 font-medium"

/** Csak olvasható cella – semleges, nem „mező” */
const cellReadOnlySurface = "bg-card/60 text-foreground"

/**
 * Szerkeszthető oszlopok – semleges sötétebb tónus, amely úgy néz ki mint
 * egy beágyazott input-mező (ugyanazt az `--input` CSS változót használjuk,
 * amit a shadcn `Input` is). Letisztult, professzionális megjelenés.
 */
const cellEditableSurface = "bg-input/35 text-foreground"

/* ------------------------------- Public API ------------------------------- */

interface TrainingWeekTableProps {
  userId: string
  week: TrainingWeek
  /** `client` (alap): csak a kliens által szerkeszthető mezők írhatók.
   *  `coach`: minden mező szerkeszthető. */
  mode?: TrainingMode
}

/**
 * Reszponzív entrypoint: `md` töréspont alatt egy workout-logger stílusú
 * kártyás mobilnézetet, felette pedig a meglévő sűrű asztali táblázatot
 * rendereli. Mindkét nézet ugyanazon a store-on osztozik, ezért egy
 * szerkesztés azonnal tükröződik a másikon is.
 */
export function TrainingWeekTable(props: TrainingWeekTableProps) {
  return (
    <>
      <div className="hidden md:block">
        <TrainingWeekDesktop {...props} />
      </div>
      <div className="md:hidden">
        <TrainingWeekMobile {...props} />
      </div>
    </>
  )
}

/* ============================================================================
 * Desktop / asztali nézet (a régi, sűrű táblázat)
 * ========================================================================= */

function TrainingWeekDesktop({
  userId,
  week,
  mode = "client",
}: TrainingWeekTableProps) {
  return (
    <Card className="border-border bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-serif text-xl uppercase tracking-wide">
          {week.title}
        </CardTitle>
        <CardDescription>{week.dateRange}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-10">
        {week.days.map((day) => (
          <TrainingDayBlock
            key={day.id}
            userId={userId}
            day={day}
            mode={mode}
          />
        ))}
      </CardContent>
    </Card>
  )
}

function TrainingDayBlock({
  userId,
  day,
  mode,
}: {
  userId: string
  day: TrainingDay
  mode: TrainingMode
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-3">
        <h3 className="font-serif text-lg font-semibold uppercase tracking-wide text-foreground">
          {day.title}
        </h3>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {day.exercises.length} gyakorlat
        </span>
      </div>

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
                rowSpan={2}
                className={cn("w-14 text-center align-middle", headerMainClass)}
              >
                Sor
              </TableHead>
              <TableHead
                rowSpan={2}
                className={cn("w-24 text-center align-middle", headerMainClass)}
              >
                Ism. tart.
              </TableHead>
              <TableHead
                colSpan={3}
                className={cn(
                  "border-l border-primary/60 text-center uppercase tracking-wider text-[11px]",
                  headerMainClass,
                )}
              >
                1. sorozat
              </TableHead>
              <TableHead
                colSpan={3}
                className={cn(
                  "border-l border-primary/60 text-center uppercase tracking-wider text-[11px]",
                  headerMainClass,
                )}
              >
                2. sorozat
              </TableHead>
              <TableHead
                rowSpan={2}
                className={cn(
                  "min-w-[160px] border-l border-primary/60 align-middle",
                  headerMainClass,
                )}
              >
                Coach jegyzet
              </TableHead>
              <TableHead
                rowSpan={2}
                className={cn("min-w-[160px] align-middle", headerMainClass)}
              >
                Saját jegyzet
              </TableHead>
              <TableHead
                rowSpan={2}
                className={cn("w-20 text-center align-middle", headerMainClass)}
              >
                Videó
              </TableHead>
            </TableRow>
            <TableRow className="hover:bg-transparent border-b border-primary/40">
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
            {day.exercises.map((exercise) => (
              <ExerciseRows
                key={exercise.id}
                userId={userId}
                dayId={day.id}
                exercise={exercise}
                mode={mode}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function ExerciseRows({
  userId,
  dayId,
  exercise,
  mode,
}: {
  userId: string
  dayId: string
  exercise: TrainingExercise
  mode: TrainingMode
}) {
  const rowCount = exercise.rows.length
  const isCoach = mode === "coach"

  const coachEditableSurface = isCoach ? cellEditableSurface : cellReadOnlySurface

  return (
    <Fragment>
      {exercise.rows.map((row, rowIdx) => {
        const isFirst = rowIdx === 0
        const isLast = rowIdx === rowCount - 1

        return (
          <TableRow
            key={row.id}
            className={cn(
              "border-b border-border/60 transition-colors",
              "hover:bg-primary/[0.03]",
              !isLast && "border-b-border/40",
              isLast && "border-b-2 border-b-border",
            )}
          >
            {isFirst && (
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
                      updateExerciseName(userId, dayId, exercise.id, v)
                    }
                    placeholder="Gyakorlat neve…"
                  />
                ) : (
                  exercise.name
                )}
              </TableCell>
            )}

            <TableCell
              className={cn(
                "text-center tabular-nums border-l border-border/40",
                isCoach ? "p-1" : "px-2 py-2",
                coachEditableSurface,
              )}
            >
              {isCoach ? (
                <EditableNumber
                  value={row.setsCount}
                  onChange={(v) =>
                    updateRowField(
                      userId,
                      dayId,
                      exercise.id,
                      row.id,
                      "setsCount",
                      v,
                    )
                  }
                  className="text-center"
                />
              ) : (
                (row.setsCount ?? "–")
              )}
            </TableCell>

            <TableCell
              className={cn(
                "text-center border-l border-border/40",
                isCoach ? "p-1" : "px-2 py-2",
                coachEditableSurface,
              )}
            >
              {isCoach ? (
                <EditableText
                  value={row.repRange}
                  onChange={(v) =>
                    updateRowField(
                      userId,
                      dayId,
                      exercise.id,
                      row.id,
                      "repRange",
                      v,
                    )
                  }
                  className="text-center"
                  placeholder="–"
                />
              ) : (
                row.repRange || "–"
              )}
            </TableCell>

            <SeriesCells
              userId={userId}
              dayId={dayId}
              exerciseId={exercise.id}
              rowId={row.id}
              slot="series1"
              reps={row.series1.reps}
              weight={row.series1.weight}
              rir={row.series1.rir}
              withBorderLeft
            />
            <SeriesCells
              userId={userId}
              dayId={dayId}
              exerciseId={exercise.id}
              rowId={row.id}
              slot="series2"
              reps={row.series2.reps}
              weight={row.series2.weight}
              rir={row.series2.rir}
              withBorderLeft
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
                        updateExerciseNote(
                          userId,
                          dayId,
                          exercise.id,
                          "coachNote",
                          v,
                        )
                      }
                      placeholder="Coach megjegyzés…"
                    />
                  ) : exercise.coachNote.trim() ? (
                    exercise.coachNote
                  ) : (
                    "–"
                  )}
                </TableCell>
                <TableCell
                  rowSpan={rowCount}
                  className={cn(
                    "align-top p-1 border-l border-border/40",
                    cellEditableSurface,
                  )}
                >
                  <EditableTextarea
                    value={exercise.clientNote}
                    onChange={(v) =>
                      updateExerciseNote(
                        userId,
                        dayId,
                        exercise.id,
                        "clientNote",
                        v,
                      )
                    }
                    placeholder="Saját megjegyzés…"
                  />
                </TableCell>
                <TableCell
                  rowSpan={rowCount}
                  className={cn(
                    "align-top text-center border-l border-border/40",
                    isCoach ? "p-1" : "px-2 py-2",
                    coachEditableSurface,
                  )}
                >
                  {isCoach ? (
                    <EditableText
                      value={exercise.videoNote}
                      onChange={(v) =>
                        updateExerciseNote(
                          userId,
                          dayId,
                          exercise.id,
                          "videoNote",
                          v,
                        )
                      }
                      placeholder="–"
                      className="text-center"
                    />
                  ) : exercise.videoNote.trim() ? (
                    exercise.videoNote
                  ) : (
                    "–"
                  )}
                </TableCell>
              </>
            )}
          </TableRow>
        )
      })}
    </Fragment>
  )
}

function SeriesCells({
  userId,
  dayId,
  exerciseId,
  rowId,
  slot,
  reps,
  weight,
  rir,
  withBorderLeft,
}: {
  userId: string
  dayId: string
  exerciseId: string
  rowId: string
  slot: SeriesSlot
  reps: number | null
  weight: number | null
  rir: number | null
  withBorderLeft?: boolean
}) {
  const setSeries = (field: SeriesField, value: number | null) =>
    updateSeriesField(userId, dayId, exerciseId, rowId, slot, field, value)

  return (
    <>
      <TableCell
        className={cn(
          "p-1 text-center",
          cellEditableSurface,
          withBorderLeft && "border-l border-border/60",
        )}
      >
        <EditableNumber
          value={reps}
          onChange={(v) => setSeries("reps", v)}
          className="text-center"
        />
      </TableCell>
      <TableCell className={cn("p-1 text-center", cellEditableSurface)}>
        <EditableNumber
          value={weight}
          onChange={(v) => setSeries("weight", v)}
          step={0.5}
          className="text-center"
        />
      </TableCell>
      <TableCell className={cn("p-1 text-center", cellEditableSurface)}>
        <EditableNumber
          value={rir}
          onChange={(v) => setSeries("rir", v)}
          className="text-center"
        />
      </TableCell>
    </>
  )
}

/* ============================================================================
 * Mobilnézet – workout logger stílus
 *
 * Tervezési szempontok:
 *   • Minimális vízszintes scroll: egyetlen függőleges stream.
 *   • A sorozat-adatok egy 2 oszlopos rácsban (1. szett / 2. szett) jelennek
 *     meg, mindegyik szett három mezővel (Ism. / Súly / RIR) egymás alatt.
 *   • „Befejezett” szett vizuálisan kiemelt (primary szegély + pipa), hogy
 *     az edzés közbeni feedback azonnali legyen.
 *   • Jegyzetek egy összecsukható sávba kerülnek, így nem tolják szét a
 *     gyakorlat-kártyát, de bármikor elérhetők.
 *   • A nap-választó vízszintes pill-sáv (sticky a szekció tetején), így
 *     hosszú gyakorlat-listánál is egy mozdulattal váltható a nap.
 * ========================================================================= */

function TrainingWeekMobile({
  userId,
  week,
  mode = "client",
}: TrainingWeekTableProps) {
  const [activeDayId, setActiveDayId] = useState<string>(
    week.days[0]?.id ?? "",
  )

  const activeDay = useMemo(
    () => week.days.find((d) => d.id === activeDayId) ?? week.days[0],
    [week.days, activeDayId],
  )

  if (!activeDay) return null

  const hasMultipleDays = week.days.length > 1

  return (
    <section className="space-y-4">
      <header className="space-y-1 px-1">
        <h2 className="font-serif text-2xl font-bold uppercase tracking-wide text-foreground">
          {week.title}
        </h2>
        <p className="text-sm text-muted-foreground">{week.dateRange}</p>
      </header>

      {hasMultipleDays && (
        <div
          role="tablist"
          aria-label="Edzésnapok"
          className={cn(
            "sticky top-16 z-20 -mx-4 px-4 py-2 flex gap-2 overflow-x-auto",
            "bg-background/80 backdrop-blur-md border-b border-border",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {week.days.map((d) => {
            const active = d.id === activeDay.id
            return (
              <button
                key={d.id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveDayId(d.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  "border",
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card/60 text-foreground border-border hover:border-primary/50",
                )}
              >
                {d.title}
              </button>
            )
          })}
        </div>
      )}

      <div className="flex items-center justify-between px-1">
        <h3 className="font-serif text-base font-semibold uppercase tracking-wider text-foreground">
          {activeDay.title}
        </h3>
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {activeDay.exercises.length} gyakorlat
        </span>
      </div>

      <ul className="space-y-4">
        {activeDay.exercises.map((exercise, idx) => (
          <li key={exercise.id}>
            <MobileExerciseCard
              userId={userId}
              dayId={activeDay.id}
              exercise={exercise}
              index={idx + 1}
              mode={mode}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

function MobileExerciseCard({
  userId,
  dayId,
  exercise,
  index,
  mode,
}: {
  userId: string
  dayId: string
  exercise: TrainingExercise
  index: number
  mode: TrainingMode
}) {
  const isCoach = mode === "coach"

  const totalSetsPlanned = exercise.rows.reduce(
    (acc, row) => acc + (row.setsCount ?? 0),
    0,
  )
  const completedSets = exercise.rows.reduce(
    (acc, row) => acc + isSeriesComplete(row.series1) + isSeriesComplete(row.series2),
    0,
  )

  const hasCoachNote = exercise.coachNote.trim().length > 0
  const hasClientNote = exercise.clientNote.trim().length > 0
  const hasVideo = exercise.videoNote.trim().length > 0

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
              onChange={(v) => updateExerciseName(userId, dayId, exercise.id, v)}
              placeholder="Gyakorlat neve…"
              className="!px-2 !py-1 text-base font-semibold leading-tight"
            />
          ) : (
            <h4 className="text-base font-semibold leading-tight text-foreground">
              {exercise.name}
            </h4>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Dumbbell className="h-3 w-3" aria-hidden />
              {completedSets}/{totalSetsPlanned || "–"} szett
            </span>
            {hasVideo && !isCoach && (
              <span className="inline-flex items-center gap-1 text-primary">
                <Clapperboard className="h-3 w-3" aria-hidden />
                Videó
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="divide-y divide-border/60">
        {exercise.rows.map((row, rowIdx) => (
          <MobileRowBlock
            key={row.id}
            userId={userId}
            dayId={dayId}
            exerciseId={exercise.id}
            row={row}
            rowIndex={rowIdx + 1}
            isCoach={isCoach}
          />
        ))}
      </div>

      <MobileNotesSection
        userId={userId}
        dayId={dayId}
        exercise={exercise}
        isCoach={isCoach}
        defaultOpen={hasCoachNote || hasClientNote || hasVideo || isCoach}
      />
    </article>
  )
}

function MobileRowBlock({
  userId,
  dayId,
  exerciseId,
  row,
  rowIndex,
  isCoach,
}: {
  userId: string
  dayId: string
  exerciseId: string
  row: ExerciseRow
  rowIndex: number
  isCoach: boolean
}) {
  return (
    <div className="space-y-3 px-4 py-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <span className="font-semibold text-foreground">Sor {rowIndex}</span>
          <span aria-hidden className="text-border">
            •
          </span>
          <span className="inline-flex items-center gap-1">
            Célzóna:
            {isCoach ? (
              <EditableText
                value={row.repRange}
                onChange={(v) =>
                  updateRowField(userId, dayId, exerciseId, row.id, "repRange", v)
                }
                className="!w-16 !px-1.5 !py-0.5 text-center text-xs"
                placeholder="–"
              />
            ) : (
              <span className="font-mono text-foreground">
                {row.repRange || "–"}
              </span>
            )}
            <span>ism.</span>
          </span>
        </div>

        {isCoach && (
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span>Előírt:</span>
            <EditableNumber
              value={row.setsCount}
              onChange={(v) =>
                updateRowField(userId, dayId, exerciseId, row.id, "setsCount", v)
              }
              className="!w-12 !px-1.5 !py-0.5 text-center text-xs"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <MobileSetTile
          label="1. szett"
          series={row.series1}
          onChange={(field, value) =>
            updateSeriesField(
              userId,
              dayId,
              exerciseId,
              row.id,
              "series1",
              field,
              value,
            )
          }
        />
        <MobileSetTile
          label="2. szett"
          series={row.series2}
          onChange={(field, value) =>
            updateSeriesField(
              userId,
              dayId,
              exerciseId,
              row.id,
              "series2",
              field,
              value,
            )
          }
        />
      </div>
    </div>
  )
}

function MobileSetTile({
  label,
  series,
  onChange,
}: {
  label: string
  series: SeriesEntry
  onChange: (field: SeriesField, value: number | null) => void
}) {
  const completed = isSeriesComplete(series) === 1
  const empty =
    series.reps === null && series.weight === null && series.rir === null

  return (
    <div
      className={cn(
        "relative rounded-lg border p-2.5 transition-colors",
        completed
          ? "border-primary/60 bg-primary/[0.06]"
          : empty
          ? "border-dashed border-border bg-card/40"
          : "border-border bg-card/70",
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-wider",
            completed ? "text-primary" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
        {completed && (
          <Check
            className="h-3.5 w-3.5 text-primary"
            aria-label="Kész szett"
          />
        )}
      </div>

      <div className="space-y-1.5">
        <MobileSetField
          label="Ism."
          value={series.reps}
          onChange={(v) => onChange("reps", v)}
        />
        <MobileSetField
          label="Súly"
          unit="kg"
          step={0.5}
          value={series.weight}
          onChange={(v) => onChange("weight", v)}
        />
        <MobileSetField
          label="RIR"
          value={series.rir}
          onChange={(v) => onChange("rir", v)}
        />
      </div>
    </div>
  )
}

function MobileSetField({
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
    <label className="flex items-center gap-2 rounded-md bg-input/35 px-2 py-1.5">
      <span className="w-10 shrink-0 text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
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
      {unit && (
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {unit}
        </span>
      )}
    </label>
  )
}

function MobileNotesSection({
  userId,
  dayId,
  exercise,
  isCoach,
  defaultOpen,
}: {
  userId: string
  dayId: string
  exercise: TrainingExercise
  isCoach: boolean
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  const hasCoachNote = exercise.coachNote.trim().length > 0
  const hasVideo = exercise.videoNote.trim().length > 0

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
          Jegyzetek & videó
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            "group-open:rotate-180",
          )}
          aria-hidden
        />
      </summary>

      <div className="space-y-3 px-4 pb-4">
        <MobileNoteBlock
          icon={<MessageSquareText className="h-3.5 w-3.5" />}
          label="Coach jegyzet"
        >
          {isCoach ? (
            <EditableTextarea
              value={exercise.coachNote}
              onChange={(v) =>
                updateExerciseNote(userId, dayId, exercise.id, "coachNote", v)
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
        </MobileNoteBlock>

        <MobileNoteBlock
          icon={<NotebookPen className="h-3.5 w-3.5" />}
          label="Saját jegyzet"
        >
          <EditableTextarea
            value={exercise.clientNote}
            onChange={(v) =>
              updateExerciseNote(userId, dayId, exercise.id, "clientNote", v)
            }
            placeholder="Mit tapasztaltál? Hogy ment?"
          />
        </MobileNoteBlock>

        <MobileNoteBlock
          icon={<Clapperboard className="h-3.5 w-3.5" />}
          label="Videó"
        >
          {isCoach ? (
            <EditableText
              value={exercise.videoNote}
              onChange={(v) =>
                updateExerciseNote(userId, dayId, exercise.id, "videoNote", v)
              }
              placeholder="Videó link vagy referencia…"
            />
          ) : (
            <p
              className={cn(
                "text-sm leading-snug",
                hasVideo ? "text-foreground" : "text-muted-foreground/70",
              )}
            >
              {hasVideo ? exercise.videoNote : "Nincs hozzárendelt videó."}
            </p>
          )}
        </MobileNoteBlock>
      </div>
    </details>
  )
}

function MobileNoteBlock({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border/80 bg-card/40 p-3">
      <div className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
        {icon}
        {label}
      </div>
      {children}
    </div>
  )
}

function isSeriesComplete(series: SeriesEntry): 0 | 1 {
  return series.reps !== null && series.weight !== null && series.rir !== null
    ? 1
    : 0
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
  return (
    <input
      type="number"
      inputMode="decimal"
      step={step}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(event) => {
        const raw = event.target.value
        if (raw === "") {
          onChange(null)
          return
        }
        const parsed = Number(raw)
        onChange(Number.isNaN(parsed) ? null : parsed)
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
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
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
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      rows={2}
      className={cn(cellInputBase, "resize-y min-h-[36px] leading-snug")}
    />
  )
}
