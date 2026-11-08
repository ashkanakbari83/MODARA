import { db } from '../db'
import { newId, nowIso } from '../ids'
import type {
  ContentInput,
  ContentItem,
  ContentStatus,
  ContentStatusChange,
  ID,
} from '../models'

/**
 * Content statuses change ONLY through changeStatus() (and the initial status given
 * to create()/duplicate()). update() always keeps the stored status, and nothing
 * else in the app is allowed to move content through the workflow.
 */
export const contentRepository = {
  async list(): Promise<ContentItem[]> {
    return db.contents.toArray()
  },

  async listByProject(projectId: ID): Promise<ContentItem[]> {
    return db.contents.where('projectId').equals(projectId).toArray()
  },

  async getById(id: ID): Promise<ContentItem | undefined> {
    return db.contents.get(id)
  },

  /** History for one item, newest first. */
  async historyFor(contentId: ID): Promise<ContentStatusChange[]> {
    const entries = await db.contentStatusHistory.where('contentId').equals(contentId).toArray()
    return entries.sort((a, b) => b.changedAt.localeCompare(a.changedAt))
  },

  async create(input: ContentInput, status: ContentStatus = 'idea'): Promise<ContentItem> {
    const now = nowIso()
    const item: ContentItem = { ...input, id: newId(), status, createdAt: now, updatedAt: now }
    await db.transaction('rw', db.contents, db.contentStatusHistory, async () => {
      await db.contents.add(item)
      await db.contentStatusHistory.add({
        id: newId(),
        contentId: item.id,
        fromStatus: null,
        toStatus: status,
        note: '',
        changedAt: now,
      })
    })
    return item
  },

  /** Saves edited fields. The workflow status is never touched here. */
  async update(id: ID, input: ContentInput): Promise<ContentItem> {
    return db.transaction('rw', db.contents, async () => {
      const existing = await db.contents.get(id)
      if (!existing) throw new Error(`Content not found: ${id}`)
      const updated: ContentItem = {
        ...input,
        id,
        status: existing.status,
        createdAt: existing.createdAt,
        updatedAt: nowIso(),
      }
      await db.contents.put(updated)
      return updated
    })
  },

  /** The one deliberate way to move content through the workflow. Saved immediately. */
  async changeStatus(id: ID, toStatus: ContentStatus, note: string): Promise<void> {
    await db.transaction('rw', db.contents, db.contentStatusHistory, async () => {
      const existing = await db.contents.get(id)
      if (!existing) throw new Error(`Content not found: ${id}`)
      if (existing.status === toStatus) return
      const now = nowIso()
      await db.contents.put({ ...existing, status: toStatus, updatedAt: now })
      await db.contentStatusHistory.add({
        id: newId(),
        contentId: id,
        fromStatus: existing.status,
        toStatus,
        note: note.trim(),
        changedAt: now,
      })
    })
  },

  /**
   * Copies the creative fields into a new "idea". Dates, actual time and the
   * publication URL are cleared because they belong to the original.
   */
  async duplicate(id: ID, title: string): Promise<ContentItem> {
    const source = await db.contents.get(id)
    if (!source) throw new Error(`Content not found: ${id}`)
    // create() replaces id, status and timestamps, so the copied fields are all that carry over.
    return contentRepository.create(
      {
        ...source,
        title,
        actualMinutes: 0,
        filmingDate: null,
        rawFootageDate: null,
        editingDeadline: null,
        reviewDeadline: null,
        publishDate: null,
        publicationUrl: '',
      },
      'idea',
    )
  },

  async remove(id: ID): Promise<void> {
    await db.transaction('rw', db.contents, db.contentStatusHistory, async () => {
      await db.contentStatusHistory.where('contentId').equals(id).delete()
      await db.contents.delete(id)
    })
  },
}
