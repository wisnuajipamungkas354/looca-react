import { Category } from "@/types"
import { initialCategories } from "@/mocks/categories"
import { LocalStorageRepository, delay } from "./mockRepo"
import { productService } from "./productService"

const repo = new LocalStorageRepository<Category>("looca_categories", initialCategories)

export const categoryService = {
  async getAll(): Promise<Category[]> {
    await delay()
    return repo.getAll()
  },

  async getById(id: number): Promise<Category | undefined> {
    await delay()
    return repo.getById(id)
  },

  async create(data: { categories_name: string }): Promise<Category> {
    await delay()
    return repo.create(data)
  },

  async update(id: number, data: Partial<Category>): Promise<Category> {
    await delay()
    return repo.update(id, data)
  },

  async remove(id: number): Promise<void> {
    await delay()
    const products = await productService.getAll()
    const isUsed = products.some((p) => p.category_id === id)
    if (isUsed) {
      const count = products.filter((p) => p.category_id === id).length
      throw new Error(`Category cannot be deleted because it is still used by ${count} product(s).`)
    }
    repo.delete(id)
  },
}
