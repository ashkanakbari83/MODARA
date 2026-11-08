import { useId, useState } from 'react'
import { cn } from '@/lib/cn'
import {
  currentJalaliYear,
  isoToJalali,
  jalaliMonthLength,
  jalaliToIso,
} from '@/lib/jalali'
import { toPersianDigits } from '@/lib/numbers'
import { messages as m } from '@/locales'
import styles from './JalaliDateField.module.css'

interface Parts {
  year: string
  month: string
  day: string
}

function partsFromIso(value: string): Parts {
  if (!value) return { year: '', month: '', day: '' }
  const date = isoToJalali(value)
  return { year: String(date.year), month: String(date.month), day: String(date.day) }
}

interface JalaliDateFieldProps {
  label: string
  /** Stored civil date "YYYY-MM-DD", or "" when no date is chosen. */
  value: string
  onChange: (value: string) => void
  hint?: string
  error?: string
}

/**
 * Optional Jalali date picker made of three selects (day, month, year).
 * It emits a Gregorian ISO date only when all three parts are chosen.
 */
export function JalaliDateField({ label, value, onChange, hint, error }: JalaliDateFieldProps) {
  const id = useId()
  const [parts, setParts] = useState<Parts>(() => partsFromIso(value))

  const baseYear = currentJalaliYear()
  const selectedYear = parts.year ? Number(parts.year) : null
  const firstYear = Math.min(baseYear - 5, selectedYear ?? baseYear)
  const lastYear = Math.max(baseYear + 10, selectedYear ?? baseYear)
  const years: number[] = []
  for (let year = firstYear; year <= lastYear; year += 1) years.push(year)

  const maxDay =
    parts.year && parts.month ? jalaliMonthLength(Number(parts.year), Number(parts.month)) : 31
  const days = Array.from({ length: maxDay }, (_, index) => index + 1)

  function update(next: Parts) {
    const complete = Boolean(next.year && next.month && next.day)
    if (!complete) {
      setParts(next)
      onChange('')
      return
    }
    const year = Number(next.year)
    const month = Number(next.month)
    const day = Math.min(Number(next.day), jalaliMonthLength(year, month))
    setParts({ year: next.year, month: next.month, day: String(day) })
    onChange(jalaliToIso({ year, month, day }))
  }

  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <fieldset className={styles.fieldset} aria-describedby={describedBy}>
      <legend className={styles.legend}>{label}</legend>
      <div className={styles.row}>
        <select
          className={cn(styles.select, error && styles.invalid)}
          aria-label={`${label}: ${m.jalali.day}`}
          value={parts.day}
          onChange={(event) => update({ ...parts, day: event.target.value })}
        >
          <option value="">{m.jalali.day}</option>
          {days.map((day) => (
            <option key={day} value={day}>
              {toPersianDigits(String(day))}
            </option>
          ))}
        </select>
        <select
          className={cn(styles.select, error && styles.invalid)}
          aria-label={`${label}: ${m.jalali.month}`}
          value={parts.month}
          onChange={(event) => update({ ...parts, month: event.target.value })}
        >
          <option value="">{m.jalali.month}</option>
          {m.jalali.months.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
        <select
          className={cn(styles.select, error && styles.invalid)}
          aria-label={`${label}: ${m.jalali.year}`}
          value={parts.year}
          onChange={(event) => update({ ...parts, year: event.target.value })}
        >
          <option value="">{m.jalali.year}</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {toPersianDigits(String(year))}
            </option>
          ))}
        </select>
      </div>
      {hint && !error ? (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
