import React, { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  user: { email: string; name: string } | null
  login: (email: string, pass: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = "looca-auth"

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === "true"
  })

  const [user, setUser] = useState<{ email: string; name: string } | null>(() => {
    const isAuth = localStorage.getItem(AUTH_STORAGE_KEY) === "true"
    return isAuth ? { email: "admin@looca.id", name: "Looca Admin" } : null
  })

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(AUTH_STORAGE_KEY, "true")
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [isAuthenticated])

  const login = async (email: string, pass: string) => {
    // Artificial slight delay for feel
    await new Promise((r) => setTimeout(r, 400))
    if (email.trim().toLowerCase() === "admin@looca.id" && pass === "admin123") {
      setIsAuthenticated(true)
      setUser({ email: "admin@looca.id", name: "Looca Admin" })
    } else {
      throw new Error("Invalid email or password. Use demo account.")
    }
  }

  const logout = () => {
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
