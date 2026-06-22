import { cn } from "@/lib/utils"
import { ReactNode } from "react"

type BadgeVariant = "red" | "yellow" | "white"

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  red: "bg-[#CC0000] text-white border border-[#CC0000]",
  yellow: "bg-[#F5C000] text-black border border-[#F5C000]",
  white: "bg-transparent text-white border border-white",
}

export function Badge({ children, variant = "red", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
