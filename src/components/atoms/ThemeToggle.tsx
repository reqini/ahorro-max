"use client"

import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isLight = theme === "light"

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      className={cn(
        "relative flex items-center gap-2 px-3 py-1.5 rounded-full",
        "border transition-all duration-300 text-xs font-bold uppercase tracking-wider",
        "select-none cursor-pointer shrink-0",
        isLight
          ? "border-[#CC0000]/50 bg-white/80 text-[#111111]"
          : "border-white/20 bg-white/5 text-white/70 hover:text-white"
      )}
    >
      {/* Sun icon */}
      <span className={cn("text-base leading-none transition-all duration-300", isLight ? "opacity-100" : "opacity-40")}>☀️</span>

      {/* Pill track */}
      <span
        className={cn(
          "relative w-9 h-5 rounded-full transition-all duration-300",
          isLight ? "bg-[#F5C000]" : "bg-white/15"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-4 h-4 rounded-full shadow transition-all duration-300",
            isLight ? "left-[18px] bg-white" : "left-0.5 bg-white/60"
          )}
        />
      </span>

      {/* Moon icon */}
      <span className={cn("text-base leading-none transition-all duration-300", !isLight ? "opacity-100" : "opacity-40")}>🌙</span>
    </button>
  )
}
