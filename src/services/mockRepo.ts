export const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export class LocalStorageRepository<T extends { id: number }> {
  private key: string

  constructor(key: string, defaultData: T[]) {
    this.key = key
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify(defaultData))
    }
  }

  getAll(): T[] {
    const raw = localStorage.getItem(this.key)
    return raw ? JSON.parse(raw) : []
  }

  setAll(data: T[]): void {
    localStorage.setItem(this.key, JSON.stringify(data))
  }

  getById(id: number): T | undefined {
    return this.getAll().find((item) => item.id === id)
  }

  create(item: Omit<T, "id">): T {
    const items = this.getAll()
    const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1
    const newItem = { ...item, id: nextId } as T
    items.unshift(newItem)
    this.setAll(items)
    return newItem
  }

  update(id: number, patch: Partial<T>): T {
    const items = this.getAll()
    const index = items.findIndex((i) => i.id === id)
    if (index === -1) throw new Error(`Item with id ${id} not found`)
    const updated = { ...items[index], ...patch }
    items[index] = updated
    this.setAll(items)
    return updated
  }

  delete(id: number): void {
    const items = this.getAll().filter((i) => i.id !== id)
    this.setAll(items)
  }
}
