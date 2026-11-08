const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

/** Converts Persian and Arabic-Indic digits to ASCII digits. */
export function normalizeDigits(text: string): string {
  return text
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)))
}

/** Converts ASCII digits to Persian digits without thousands separators (for years, days). */
export function toPersianDigits(text: string): string {
  return text.replace(/\d/g, (digit) => PERSIAN_DIGITS.charAt(Number(digit)))
}

/**
 * Parses a user-typed non-negative number. Accepts Persian digits, spaces and
 * thousands separators. Returns null for blank input and NaN for invalid input.
 */
export function parseNumberInput(text: string): number | null {
  const cleaned = normalizeDigits(text)
    .replace(/[\s,٬،]/g, '')
    .replace(/٫/g, '.')
  if (cleaned === '') return null
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return Number.NaN
  return Number(cleaned)
}
