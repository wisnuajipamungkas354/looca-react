import { Workshop } from "@/types"
import { apiClient } from "./apiClient"

export const workshopService = {
  async getAll(): Promise<Workshop[]> {
    return apiClient.get<Workshop[]>("/api/admin/workshops")
  },

  async getById(id: number): Promise<Workshop | undefined> {
    try {
      return await apiClient.get<Workshop>(`/api/admin/workshops/${id}`)
    } catch {
      return undefined
    }
  },

  async create(data: Omit<Workshop, "id" | "total_play">): Promise<Workshop> {
    return apiClient.post<Workshop>("/api/admin/workshops", data)
  },

  async update(id: number, patch: Partial<Workshop>): Promise<Workshop> {
    let payload = patch
    if (!patch.title || !patch.description || !patch.thumbnail) {
      const current = await this.getById(id)
      if (current) {
        payload = { ...current, ...patch }
      }
    }
    return apiClient.put<Workshop>(`/api/admin/workshops/${id}`, payload)
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/api/admin/workshops/${id}`)
  },
}
