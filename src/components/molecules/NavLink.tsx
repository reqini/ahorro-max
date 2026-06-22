"use client"

import { smoothScrollTo } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface NavLinkProps {
  href: string
  label: string
  className?: string
  onClick?: () => void
}

export function NavLink({ href, label, className, onClick }: NavLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      smoothScrollTo(href.slice(1))
      onClick?.()
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "text-white/80 hover:text-[#F5C000] font-bold uppercase tracking-wider text-sm",
        "transition-colors duration-150 relative",
        "after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5",
        "after:bg-[#CC0000] hover:after:w-full after:transition-all after:duration-200",
        className
      )}
    >
      {label}
    </a>
  )
}
