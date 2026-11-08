import { localeConfig, messages as m } from '@/locales'

const MS_PER_DAY = 86_400_000

const decimalFormatter = new Intl.NumberFormat(localeConfig.numberLocale, {
  maximumFractionDigits: 1,
})
const integerFormatter = new Intl.NumberFormat(localeConfig.numberLocale, {
  maximumFractionDigits: 0,
})
const percentFormatter = new Intl.NumberFormat(localeConfig.numberLocale, {
  style: 'percent',
  maximumFractionDigits: 0,
})
const longDateFormatter = new Intl.DateTimeFormat(localeConfig.calendarLocale, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: localeConfig.timeZone,
})
const shortDateFormatter = new Intl.DateTimeFormat(localeConfig.calendarLocale, {
  day: 'numeric',
  month: 'long',
  timeZone: localeConfig.timeZone,
})
const hourFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  hourCycle: 'h23',
  timeZone: localeConfig.timeZone,
})

export type GreetingKey = 'morning' | 'afternoon' | 'evening' | 'night'

/** Formats a number with Persian digits (at most one decimal place). */
export function formatNumber(value: number): string {
  return decimalFormatter.format(value)
}

/** Formats a whole number with Persian digits and thousands separators. */
export function formatInteger(value: number): string {
  return integerFormatter.format(value)
}

/** Formats a 0..1 ratio as a Persian percentage. */
export function formatPercent(ratio: number): string {
  return percentFormatter.format(ratio)
}

/** Full amount in Toman, e.g. "۴۵٬۰۰۰٬۰۰۰ تومان". */
export function formatToman(value: number): string {
  return `${formatInteger(value)} ${m.common.toman}`
}

/** Short amount in Toman, e.g. "۴۵ میلیون تومان". */
export function formatCompactToman(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000_000) {
    return `${formatNumber(value / 1_000_000_000)} ${m.common.billion} ${m.common.toman}`
  }
  if (abs >= 1_000_000) {
    return `${formatNumber(value / 1_000_000)} ${m.common.million} ${m.common.toman}`
  }
  return formatToman(value)
}

/** Duration in minutes as text, e.g. "۴ ساعت و ۳۰ دقیقه". */
export function formatDuration(totalMinutes: number): string {
  const minutes = Math.round(Math.abs(totalMinutes))
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${formatNumber(rest)} ${m.common.minute}`
  if (rest === 0) return `${formatNumber(hours)} ${m.common.hour}`
  return `${formatNumber(hours)} ${m.common.hour} ${m.common.and} ${formatNumber(rest)} ${m.common.minute}`
}

/**
 * Adds whole days to a date. Iran no longer observes daylight saving time,
 * so a fixed 24-hour step is safe for Asia/Tehran.
 */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY)
}

/** Jalali date with weekday, e.g. "شنبه ۱۶ آبان ۱۴۰۵". */
export function formatJalaliLong(date: Date): string {
  return longDateFormatter.format(date)
}

/** Jalali day and month, e.g. "۱۶ آبان". */
export function formatJalaliShort(date: Date): string {
  return shortDateFormatter.format(date)
}

/** "امروز", "فردا", "۳ روز دیگر", "۲ روز پیش" ... */
export function formatRelativeDay(dayOffset: number): string {
  if (dayOffset === 0) return m.common.today
  if (dayOffset === 1) return m.common.tomorrow
  if (dayOffset === 2) return m.common.dayAfterTomorrow
  if (dayOffset > 0) return `${formatNumber(dayOffset)} ${m.common.daysLeft}`
  return `${formatNumber(Math.abs(dayOffset))} ${m.common.daysAgo}`
}

/** Picks a greeting key from the hour in the Asia/Tehran time zone. */
export function getGreetingKey(date: Date): GreetingKey {
  const hour = Number(hourFormatter.format(date))
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}
