const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  ""
).replace(/\/$/, "")

export const getToken = (): string | null => {
  return localStorage.getItem("looca_token")
}

export const setToken = (token: string): void => {
  localStorage.setItem("looca_token", token)
}

export const removeToken = (): void => {
  localStorage.removeItem("looca_token")
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`
  const headers = new Headers(options.headers || {})

  const token = getToken()
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const isFormData = options.body instanceof FormData
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`
    try {
      const errorJson = await response.json()
      if (errorJson && errorJson.message) {
        errorMessage = errorJson.message
      }
    } catch {
      // Body not JSON, fallback to status text
      if (response.statusText) {
        errorMessage = response.statusText
      }
    }

    if (response.status === 401 && window.location.pathname !== "/login") {
      removeToken()
      localStorage.removeItem("looca_user")
      window.location.href = "/login"
    }

    throw new Error(errorMessage)
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json() as Promise<T>
}

export function upload<T>(
  endpoint: string,
  formData: FormData,
  onProgress?: (percent: number) => void
): Promise<T> {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`
    const xhr = new XMLHttpRequest()

    xhr.open("POST", url)

    const token = getToken()
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`)
    }

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          onProgress(percent)
        }
      }
    }

    xhr.onload = () => {
      let responseData: any = {}
      try {
        responseData = JSON.parse(xhr.responseText)
      } catch {
        // Not JSON
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(responseData as T)
      } else {
        const errorMsg =
          responseData?.message || xhr.statusText || `Upload failed with status ${xhr.status}`
        reject(new Error(errorMsg))
      }
    }

    xhr.onerror = () => {
      reject(new Error("Network error during file upload"))
    }

    xhr.send(formData)
  })
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
  upload,
}
