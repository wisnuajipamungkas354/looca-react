import React, { createContext, useContext, useState, useEffect } from "react"
import { apiClient, getToken, setToken, removeToken } from "@/services/apiClient"

interface User {
  email: string
  name: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, pass: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USER_STORAGE_KEY = "looca_user"

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(getToken())
  })

  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch {
        return null
      }
    }
    return null
  })

  useEffect(() => {
    const verifySession = async () => {
      const token = getToken()
      if (!token) {
        setIsAuthenticated(false)
        setUser(null)
        return
      }

      try {
        const currentUser = await apiClient.get<User>("/api/admin/me")
        setUser(currentUser)
        setIsAuthenticated(true)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser))
      } catch {
        // Token invalid or expired
        removeToken()
        localStorage.removeItem(USER_STORAGE_KEY)
        setIsAuthenticated(false)
        setUser(null)
      }
    }

    verifySession()
  }, [])

  const login = async (email: string, pass: string) => {
    const data = await apiClient.post<{ token: string; user: User }>("/api/auth/login", {
      email,
      password: pass,
    })

    setToken(data.token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user))
    setIsAuthenticated(true)
    setUser(data.user)
  }

  const logout = () => {
    removeToken()
    localStorage.removeItem(USER_STORAGE_KEY)
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
