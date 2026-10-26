import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative flex items-center justify-center w-10 h-10 rounded-full border border-pink/50 dark:border-white/10 bg-card hover:bg-secondary transition-all hover:scale-105 shadow-xs text-foreground cursor-pointer"
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Moon className="h-4 w-4 text-pink-deep" />
      ) : (
        <Sun className="h-4 w-4 text-amber-500" />
      )}
    </button>
  )
}
