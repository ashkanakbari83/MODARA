/**
 * The current moment. Kept in one place so components do not call new Date()
 * while rendering, and so tests can replace it later.
 */
export function currentDate(): Date {
  return new Date()
}
