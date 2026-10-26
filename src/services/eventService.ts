import { UpcomingEvent } from "@/types"
import { initialEvents } from "@/mocks/events"
import { LocalStorageRepository, delay } from "./mockRepo"

const repo = new LocalStorageRepository<UpcomingEvent>("looca_events", initialEvents)

export const eventService = {
  async getAll(): Promise<UpcomingEvent[]> {
    await delay()
    return repo.getAll()
  },

  async getById(id: number): Promise<UpcomingEvent | undefined> {
    await delay()
    return repo.getById(id)
  },

  async create(data: Omit<UpcomingEvent, "id">): Promise<UpcomingEvent> {
    await delay()
    return repo.create(data)
  },

  async update(id: number, patch: Partial<UpcomingEvent>): Promise<UpcomingEvent> {
    await delay()
    return repo.update(id, patch)
  },

  async toggleActive(id: number): Promise<UpcomingEvent> {
    await delay(150)
    const current = repo.getById(id)
    if (!current) throw new Error("Event not found")
    return repo.update(id, { is_active: !current.is_active })
  },

  async remove(id: number): Promise<void> {
    await delay()
    repo.delete(id)
  },
}
