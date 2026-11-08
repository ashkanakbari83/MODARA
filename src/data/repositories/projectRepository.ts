import { db } from '../db'
import { newId, nowIso } from '../ids'
import type { ID, Project, ProjectInput, ProjectStatus } from '../models'

/**
 * All reads and writes of projects go through here, so components never touch
 * Dexie directly. When content, tasks and files exist, remove() must also delete
 * or detach their dependent records inside one transaction.
 */
export const projectRepository = {
  async list(): Promise<Project[]> {
    const projects = await db.projects.toArray()
    return projects.sort((a, b) => a.name.localeCompare(b.name, 'fa'))
  },

  async getById(id: ID): Promise<Project | undefined> {
    return db.projects.get(id)
  },

  async create(input: ProjectInput): Promise<Project> {
    const now = nowIso()
    const project: Project = { ...input, id: newId(), createdAt: now, updatedAt: now }
    await db.projects.add(project)
    return project
  },

  async update(id: ID, input: ProjectInput): Promise<Project> {
    return db.transaction('rw', db.projects, async () => {
      const existing = await db.projects.get(id)
      if (!existing) throw new Error(`Project not found: ${id}`)
      const updated: Project = {
        ...input,
        id,
        createdAt: existing.createdAt,
        updatedAt: nowIso(),
      }
      await db.projects.put(updated)
      return updated
    })
  },

  async setStatus(id: ID, status: ProjectStatus): Promise<void> {
    await db.transaction('rw', db.projects, async () => {
      const existing = await db.projects.get(id)
      if (!existing) throw new Error(`Project not found: ${id}`)
      await db.projects.put({ ...existing, status, updatedAt: nowIso() })
    })
  },

  async remove(id: ID): Promise<void> {
    await db.projects.delete(id)
  },
}
