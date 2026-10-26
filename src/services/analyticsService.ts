import { AnalyticsData } from "@/types"
import { initialAnalytics } from "@/mocks/analytics"
import { delay } from "./mockRepo"

export const analyticsService = {
  async get(): Promise<AnalyticsData> {
    await delay()
    return initialAnalytics
  },
}
