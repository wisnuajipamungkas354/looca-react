import React from "react"
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  ShoppingBag,
  Palette,
  CalendarHeart,
  Settings,
} from "lucide-react"

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/products", label: "Products", icon: ShoppingBag },
    { to: "/workshop", label: "Workshop", icon: Palette },
    { to: "/events", label: "Events", icon: CalendarHeart },
    { to: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t-2 border-pink/50 rounded-t-3xl shadow-lg px-2 pb-[env(safe-area-inset-bottom)] pt-1 select-none">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all cursor-pointer ${
                  isActive
                    ? "text-pink-deep font-bold scale-105"
                    : "text-muted-foreground hover:text-foreground font-medium"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
