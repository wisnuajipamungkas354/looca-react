import { Product } from "@/types"
import { initialProducts } from "@/mocks/products"
import { LocalStorageRepository, delay } from "./mockRepo"

const repo = new LocalStorageRepository<Product>("looca_products", initialProducts)

export const productService = {
  async getAll(): Promise<Product[]> {
    await delay()
    return repo.getAll()
  },

  async getById(id: number): Promise<Product | undefined> {
    await delay()
    return repo.getById(id)
  },

  async create(data: Omit<Product, "id" | "total_click">): Promise<Product> {
    await delay()
    return repo.create({ ...data, total_click: 0 })
  },

  async update(id: number, patch: Partial<Product>): Promise<Product> {
    await delay()
    return repo.update(id, patch)
  },

  async remove(id: number): Promise<void> {
    await delay()
    repo.delete(id)
  },
}
