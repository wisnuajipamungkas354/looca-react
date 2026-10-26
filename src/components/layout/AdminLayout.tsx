import React from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { BottomNav } from "./BottomNav"
import { ModeToggle } from "@/components/mode-toggle"

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row text-foreground">
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b-2 border-pink/40 bg-card sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="Looca Logo"
            className="h-8 w-8 rounded-full object-cover border-2 border-pink-deep"
          />
          <span className="font-heading font-black text-lg text-foreground">Looca Admin</span>
        </div>
        <ModeToggle />
      </header>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
