/** New stable record id (UUID v4). */
export function newId(): string {
  return crypto.randomUUID()
}

/** Current moment as an ISO 8601 timestamp, used for createdAt / updatedAt. */
export function nowIso(): string {
  return new Date().toISOString()
}
