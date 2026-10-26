import { SiteSettings } from "@/types"
import { apiClient } from "./apiClient"

export const settingsService = {
  async get(): Promise<SiteSettings> {
    return apiClient.get<SiteSettings>("/api/admin/settings")
  },

  async save(data: SiteSettings): Promise<SiteSettings> {
    return apiClient.put<SiteSettings>("/api/admin/settings", data)
  },
}
