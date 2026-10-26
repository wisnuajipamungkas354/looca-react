import { Category } from "@/types"
import { apiClient } from "./apiClient"

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return apiClient.get<Category[]>("/api/admin/categories")
  },

  async getById(id: number): Promise<Category | undefined> {
    const categories = await this.getAll()
    return categories.find((c) => c.id === id)
  },

  async create(data: { categories_name: string }): Promise<Category> {
    return apiClient.post<Category>("/api/admin/categories", data)
  },

  async update(id: number, data: Partial<Category>): Promise<Category> {
    return apiClient.put<Category>(`/api/admin/categories/${id}`, {
      categories_name: data.categories_name,
    })
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/api/admin/categories/${id}`)
  },
}
