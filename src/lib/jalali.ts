import { localeConfig } from '@/locales'

/**
 * Jalali (Persian) calendar helpers built on the browser's Intl support.
 * Civil dates are exchanged as ISO "YYYY-MM-DD" strings and handled as
 * UTC-noon Date objects so the user's time zone can never shift the day.
 */

export interface JalaliDate {
  year: number
  month: number
  day: number
}

const MS_PER_DAY = 86_400_000

const jalaliFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  timeZone: 'UTC',
})

const tehranDayFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: localeConfig.timeZone,
})

function partsToNumbers(parts: Intl.DateTimeFormatPart[]): Record<string, number> {
  const result: Record<string, number> = {}
  for (const part of parts) {
    if (part.type === 'year' || part.type === 'month' || part.type === 'day') {
      result[part.type] = Number(part.value)
    }
  }
  return result
}

function addUtcDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY)
}

function compare(a: JalaliDate, b: JalaliDate): number {
  return a.year - b.year || a.month - b.month || a.day - b.day
}

/** Day number within the Jalali year (1..366). */
function dayOfYear(date: JalaliDate): number {
  const before = date.month <= 6 ? (date.month - 1) * 31 : 186 + (date.month - 7) * 30
  return before + date.day
}

/** "YYYY-MM-DD" to a UTC-noon Date. */
export function isoToDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day, 12))
}

/** UTC-noon Date to "YYYY-MM-DD". */
export function dateToIso(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/** Today's civil date in the workspace time zone, as "YYYY-MM-DD". */
export function todayIso(now: Date = new Date()): string {
  const parts = tehranDayFormatter.formatToParts(now)
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

export function dateToJalali(date: Date): JalaliDate {
  const { year, month, day } = partsToNumbers(jalaliFormatter.formatToParts(date))
  return { year, month, day }
}

export function isoToJalali(iso: string): JalaliDate {
  return dateToJalali(isoToDate(iso))
}

/**
 * Jalali to Gregorian: start from the approximate date and step day by day
 * until the Jalali parts match. Invalid dates (such as 30 Esfand in a common
 * year) never match, so check them with isValidJalali first.
 */
export function jalaliToDate(target: JalaliDate): Date {
  let guess = addUtcDays(new Date(Date.UTC(target.year + 621, 2, 21, 12)), dayOfYear(target) - 1)
  for (let step = 0; step < 12; step += 1) {
    const order = compare(dateToJalali(guess), target)
    if (order === 0) return guess
    guess = addUtcDays(guess, order < 0 ? 1 : -1)
  }
  return guess
}

export function isValidJalali(date: JalaliDate): boolean {
  if (date.month < 1 || date.month > 12 || date.day < 1 || date.day > 31) return false
  return compare(dateToJalali(jalaliToDate(date)), date) === 0
}

export function jalaliToIso(date: JalaliDate): string {
  return dateToIso(jalaliToDate(date))
}

/** Number of days in a Jalali month (Esfand has 30 days in leap years). */
export function jalaliMonthLength(year: number, month: number): number {
  if (month <= 6) return 31
  if (month <= 11) return 30
  return isValidJalali({ year, month: 12, day: 30 }) ? 30 : 29
}

export function currentJalaliYear(): number {
  return isoToJalali(todayIso()).year
}
