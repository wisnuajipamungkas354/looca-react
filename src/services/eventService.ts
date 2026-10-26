import { UpcomingEvent } from "@/types"
import { apiClient } from "./apiClient"

export const eventService = {
  async getAll(): Promise<UpcomingEvent[]> {
    return apiClient.get<UpcomingEvent[]>("/api/admin/events")
  },

  async getById(id: number): Promise<UpcomingEvent | undefined> {
    try {
      return await apiClient.get<UpcomingEvent>(`/api/admin/events/${id}`)
    } catch {
      return undefined
    }
  },

  async create(data: Omit<UpcomingEvent, "id">): Promise<UpcomingEvent> {
    return apiClient.post<UpcomingEvent>("/api/admin/events", data)
  },

  async update(id: number, patch: Partial<UpcomingEvent>): Promise<UpcomingEvent> {
    let payload = patch
    if (!patch.title || !patch.poster || !patch.place) {
      const current = await this.getById(id)
      if (current) {
        payload = { ...current, ...patch }
      }
    }
    return apiClient.put<UpcomingEvent>(`/api/admin/events/${id}`, payload)
  },

  async toggleActive(id: number): Promise<UpcomingEvent> {
    const current = await this.getById(id)
    if (!current) throw new Error("Event not found")
    return this.update(id, { ...current, is_active: !current.is_active })
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/api/admin/events/${id}`)
  },
}
