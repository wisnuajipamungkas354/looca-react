import { SiteSettings, AnalyticsData } from "@/types"
import { initialSettings } from "@/mocks/settings"
import { initialAnalytics } from "@/mocks/analytics"
import { delay } from "./mockRepo"

const SETTINGS_KEY = "looca_site_settings"

export const settingsService = {
  async get(): Promise<SiteSettings> {
    await delay()
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? JSON.parse(raw) : initialSettings
  },

  async save(data: SiteSettings): Promise<SiteSettings> {
    await delay()
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(data))
    return data
  },
}

export const analyticsService = {
  async get(): Promise<AnalyticsData> {
    await delay()
    return initialAnalytics
  },
}

export const uploadService = {
  // Mock image upload: converts or keeps dataUrl and simulates upload latency
  async uploadImage(dataUrl: string): Promise<string> {
    await delay(300)
    // In production backend, this would be: FormData upload -> return cloud URL (e.g., S3/Cloudinary)
    return dataUrl
  },

  // Mock video upload: simulates file progress and returns an object URL
  async uploadVideo(file: File, onProgress?: (percent: number) => void): Promise<string> {
    let p = 0
    while (p < 100) {
      p += 25
      if (onProgress) onProgress(p)
      await delay(250)
    }
    // In production backend, this would upload the binary to storage and return the public video URL
    return URL.createObjectURL(file)
  },
}
