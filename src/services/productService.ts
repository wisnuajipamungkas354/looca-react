import { Product } from "@/types"
import { apiClient } from "./apiClient"

export const productService = {
  async getAll(): Promise<Product[]> {
    return apiClient.get<Product[]>("/api/admin/products")
  },

  async getById(id: number): Promise<Product | undefined> {
    try {
      return await apiClient.get<Product>(`/api/admin/products/${id}`)
    } catch {
      return undefined
    }
  },

  async create(data: Omit<Product, "id" | "total_click" | "slug">): Promise<Product> {
    return apiClient.post<Product>("/api/admin/products", data)
  },

  async update(id: number, patch: Partial<Product>): Promise<Product> {
    let payload = patch
    // If not all required fields are present in patch, merge with current
    if (!patch.name || !patch.category_id || !patch.images || !patch.action_link || !patch.action_label) {
      const current = await this.getById(id)
      if (current) {
        payload = { ...current, ...patch }
      }
    }

    return apiClient.put<Product>(`/api/admin/products/${id}`, payload)
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/api/admin/products/${id}`)
  },
}
