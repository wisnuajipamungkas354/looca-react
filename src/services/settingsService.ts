import { SiteSettings } from "@/types"
import { initialSettings } from "@/mocks/settings"
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
