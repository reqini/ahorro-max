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
    // Los anchors del home ("#mayorista" o "/#mayorista") solo hacen scroll suave
    // si ya estamos en el home. Si no, se deja la navegación normal del browser
    // (te lleva a "/" y salta al ancla solo, como cualquier link con hash).
    const hashIndex = href.indexOf("#")
    if (hashIndex === -1) return

    const pathPart = href.slice(0, hashIndex)
    const targetsHome = pathPart === "" || pathPart === "/"
    const onHomePage = typeof window !== "undefined" && window.location.pathname === "/"

    if (targetsHome && onHomePage) {
      e.preventDefault()
      smoothScrollTo(href.slice(hashIndex + 1))
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
