import { Workshop } from "@/types"
import { initialWorkshops } from "@/mocks/workshops"
import { LocalStorageRepository, delay } from "./mockRepo"

const repo = new LocalStorageRepository<Workshop>("looca_workshops", initialWorkshops)

export const workshopService = {
  async getAll(): Promise<Workshop[]> {
    await delay()
    return repo.getAll()
  },

  async getById(id: number): Promise<Workshop | undefined> {
    await delay()
    return repo.getById(id)
  },

  async create(data: Omit<Workshop, "id" | "total_play">): Promise<Workshop> {
    await delay()
    return repo.create({ ...data, total_play: 0 })
  },

  async update(id: number, patch: Partial<Workshop>): Promise<Workshop> {
    await delay()
    return repo.update(id, patch)
  },

  async remove(id: number): Promise<void> {
    await delay()
    repo.delete(id)
  },
}
