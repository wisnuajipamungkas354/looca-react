import { AnalyticsData } from "@/types"
import { apiClient } from "./apiClient"

export const analyticsService = {
  async get(): Promise<AnalyticsData> {
    return apiClient.get<AnalyticsData>("/api/admin/analytics")
  },

  async getStats(): Promise<{ total_products: number; total_workshops: number; total_events: number }> {
    return apiClient.get<{ total_products: number; total_workshops: number; total_events: number }>("/api/admin/stats")
  },
}
