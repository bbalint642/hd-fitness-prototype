/**
 * Date helpers for the training week view. Everything operates on local
 * calendar dates; we intentionally avoid UTC conversions so a workout "on
 * 2026-04-13" is the same doc regardless of the user's timezone shift.
 */

export function toYyyyMmDd(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function parseYyyyMmDd(value: string): Date {
  const [y, m, d] = value.split("-").map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

/**
 * Monday-start week. Returns a date at 00:00 local time on Monday of the
 * containing week.
 */
export function startOfWeek(date: Date): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = copy.getDay()
  // Sunday = 0 → go back 6; otherwise go back (day - 1).
  const offset = day === 0 ? -6 : 1 - day
  return addDays(copy, offset)
}

export function endOfWeek(date: Date): Date {
  return addDays(startOfWeek(date), 6)
}

/** Array of 7 Date objects for the week containing `date`. */
export function weekDays(date: Date): Date[] {
  const start = startOfWeek(date)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

const HU_MONTH = [
  "január",
  "február",
  "március",
  "április",
  "május",
  "június",
  "július",
  "augusztus",
  "szeptember",
  "október",
  "november",
  "december",
]

const HU_DAY = [
  "vasárnap",
  "hétfő",
  "kedd",
  "szerda",
  "csütörtök",
  "péntek",
  "szombat",
]

export function formatWeekRangeHu(weekStart: Date): string {
  const start = weekStart
  const end = endOfWeek(weekStart)
  const startLabel = `${HU_MONTH[start.getMonth()]} ${start.getDate()}.`
  if (start.getMonth() === end.getMonth()) {
    return `${startLabel} – ${end.getDate()}.`
  }
  return `${startLabel} – ${HU_MONTH[end.getMonth()]} ${end.getDate()}.`
}

export function formatDayLabelHu(date: Date): string {
  return `${HU_DAY[date.getDay()]}, ${date.getDate()}.`
}

/** Stable week identifier (YYYY-Www) — currently for display keys only. */
export function isoWeekId(date: Date): string {
  const target = new Date(date.valueOf())
  const dayNr = (date.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNr + 3)
  const firstThursday = target.valueOf()
  target.setMonth(0, 1)
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7))
  }
  const week =
    1 + Math.ceil((firstThursday - target.valueOf()) / (7 * 24 * 3600 * 1000))
  return `${date.getFullYear()}-W${String(week).padStart(2, "0")}`
}
