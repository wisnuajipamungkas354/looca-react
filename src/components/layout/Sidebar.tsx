import React, { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  ShoppingBag,
  Palette,
  CalendarHeart,
  Settings,
  ChevronDown,
  LogOut,
  Sparkles,
} from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/context/AuthContext"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"

export const Sidebar: React.FC = () => {
  const { pathname } = useLocation()
  const { logout, user } = useAuth()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(() => pathname.startsWith("/products"))

  const isProductsActive = pathname.startsWith("/products")

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r-2 border-pink/40 bg-card p-5 justify-between select-none">
      {/* Top brand header */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <img
            src="/logo.png"
            alt="Looca Logo"
            className="h-10 w-10 rounded-full object-cover border-2 border-pink-deep shadow-xs"
          />
          <div>
            <h2 className="font-heading font-black text-xl tracking-tight text-foreground flex items-center gap-1.5">
              Looca <span className="text-pink-deep text-[11px] font-bold px-2 py-0.5 rounded-full bg-pink-light dark:bg-pink-900/30">Admin</span>
            </h2>
            <p className="text-[11px] text-muted-foreground font-medium">Store & Workshop</p>
          </div>
        </div>

        {/* Menu list */}
        <nav className="space-y-1.5">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                isActive
                  ? "bg-pink-light dark:bg-secondary text-pink-deep shadow-xs translate-x-1"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>

          {/* Products with collapsible sub menu */}
          <div className="space-y-1">
            <button
              onClick={() => setProductsOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all cursor-pointer ${
                isProductsActive
                  ? "bg-pink-light dark:bg-secondary text-pink-deep shadow-xs"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4" />
                <span>Products</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  productsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {productsOpen && (
              <div className="pl-6 pr-2 space-y-1 pt-1.5 pb-1">
                <NavLink
                  to="/products"
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "text-pink-deep font-bold bg-pink-light/70 dark:bg-pink-950/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`
                  }
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                  <span>List Products</span>
                </NavLink>
                <NavLink
                  to="/products/categories"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "text-pink-deep font-bold bg-pink-light/70 dark:bg-pink-950/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`
                  }
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                  <span>Categories</span>
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/workshop"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                isActive
                  ? "bg-pink-light dark:bg-secondary text-pink-deep shadow-xs translate-x-1"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`
            }
          >
            <Palette className="h-4 w-4" />
            <span>Workshop</span>
          </NavLink>

          <NavLink
            to="/events"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                isActive
                  ? "bg-pink-light dark:bg-secondary text-pink-deep shadow-xs translate-x-1"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`
            }
          >
            <CalendarHeart className="h-4 w-4" />
            <span>Upcoming Events</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                isActive
                  ? "bg-pink-light dark:bg-secondary text-pink-deep shadow-xs translate-x-1"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`
            }
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      {/* Bottom user profile & controls */}
      <div className="space-y-4 pt-4 border-t border-pink/30">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-medium text-muted-foreground">
            Theme
          </span>
          <ModeToggle />
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-secondary/50 border border-pink/30">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-pink-deep text-white flex items-center justify-center font-bold text-xs shrink-0">
              LA
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-foreground truncate">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email || "admin@looca.id"}</p>
            </div>
          </div>
          <button
            onClick={() => setLogoutOpen(true)}
            className="p-1.5 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Log out from Looca Admin?"
        description="You will need to re-enter your credentials to access the admin dashboard again."
        confirmLabel="Log Out"
        onConfirm={logout}
      />
    </aside>
  )
}
