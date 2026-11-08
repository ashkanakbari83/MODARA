import Dexie from 'dexie'
import type { EntityTable } from 'dexie'
import type { AppSettings, ContentItem, ContentStatusChange, Project } from './models'

export const DB_NAME = 'modara'

export type ModaraDatabase = Dexie & {
  projects: EntityTable<Project, 'id'>
  settings: EntityTable<AppSettings, 'id'>
  contents: EntityTable<ContentItem, 'id'>
  contentStatusHistory: EntityTable<ContentStatusChange, 'id'>
}

export const db = new Dexie(DB_NAME) as ModaraDatabase

/**
 * Schema versions. Never edit a released version: add a new db.version(n)
 * block with the changed stores (and an upgrade function when data must move).
 */
db.version(1).stores({
  projects: 'id, status, name, updatedAt',
  settings: 'id',
})

/** Version 2 adds content items and their status history. Existing tables are unchanged. */
db.version(2).stores({
  contents: 'id, projectId, status, contentType, priority, publishDate, updatedAt',
  contentStatusHistory: 'id, contentId, changedAt',
})
