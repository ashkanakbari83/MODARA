import { db } from '../db'
import { nowIso } from '../ids'
import { DEFAULT_SETTINGS } from '../models'
import type { AppSettings } from '../models'

export const settingsRepository = {
  /** Saved settings, or the defaults when nothing has been saved yet. */
  async get(): Promise<AppSettings> {
    return (await db.settings.get('workspace')) ?? DEFAULT_SETTINGS
  },

  async save(changes: Partial<Omit<AppSettings, 'id' | 'updatedAt'>>): Promise<AppSettings> {
    return db.transaction('rw', db.settings, async () => {
      const current = (await db.settings.get('workspace')) ?? DEFAULT_SETTINGS
      const next: AppSettings = { ...current, ...changes, id: 'workspace', updatedAt: nowIso() }
      await db.settings.put(next)
      return next
    })
  },
}
