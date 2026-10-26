import { apiClient } from "./apiClient"

export const uploadService = {
  // Upload cropped image dataUrl or image file to backend
  async uploadImage(dataUrl: string): Promise<string> {
    if (dataUrl.startsWith("/uploads/") || dataUrl.startsWith("http://") || dataUrl.startsWith("https://")) {
      return dataUrl
    }

    const res = await fetch(dataUrl)
    const blob = await res.blob()

    const formData = new FormData()
    formData.append("file", blob, "cropped-image.jpg")

    const result = await apiClient.upload<{ url: string }>("/api/admin/uploads/image", formData)
    return result.url
  },

  // Upload video binary with progress callback
  async uploadVideo(file: File, onProgress?: (percent: number) => void): Promise<string> {
    const formData = new FormData()
    formData.append("file", file, file.name)

    const result = await apiClient.upload<{ url: string }>(
      "/api/admin/uploads/video",
      formData,
      onProgress
    )
    return result.url
  },
}
