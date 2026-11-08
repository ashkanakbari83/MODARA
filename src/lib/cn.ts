type ClassPart = string | false | null | undefined

/** Joins class names, skipping falsy values. */
export function cn(...parts: ClassPart[]): string {
  return parts.filter(Boolean).join(' ')
}
