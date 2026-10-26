import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/AuthContext"
import { ProtectedRoute } from "@/routes/ProtectedRoute"
import { AdminLayout } from "@/components/layout/AdminLayout"

// Pages
import { LoginPage } from "@/pages/LoginPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { ProductsPage } from "@/pages/products/ProductsPage"
import { CategoriesPage } from "@/pages/products/CategoriesPage"
import { WorkshopPage } from "@/pages/WorkshopPage"
import { EventsPage } from "@/pages/EventsPage"
import { SettingsPage } from "@/pages/SettingsPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

export function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="looca-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected admin dashboard routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/categories" element={<CategoriesPage />} />
                <Route path="/workshop" element={<WorkshopPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              borderRadius: "1.25rem",
              fontFamily: "Inter, sans-serif",
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
