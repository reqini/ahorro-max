"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { NavLink } from "@/components/molecules"
import { NAVBAR_LINKS } from "@/constants"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 overflow-visible transition-all duration-300",
        scrolled
          ? "shadow-[0_4px_32px_rgba(204,0,0,0.15)]"
          : ""
      )}
      style={{
        backgroundColor: "var(--th-nav-bg)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(204,0,0,0.6)" : "1px solid rgba(204,0,0,0.35)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between overflow-visible">

        {/* Logo — crece al hacer scroll, sobresale hacia abajo */}
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) }}
          aria-label="Inicio"
          className="shrink-0 relative block rounded-xl overflow-hidden"
          style={{
            width:  scrolled ? 108 : 72,
            height: scrolled ? 108 : 72,
            transform: scrolled ? "translateY(18px)" : "translateY(0)",
            filter: scrolled
              ? "drop-shadow(0 6px 20px rgba(204,0,0,0.85)) drop-shadow(0 0 8px rgba(245,192,0,0.3))"
              : "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
            transition: "width 0.4s cubic-bezier(0.34,1.56,0.64,1), height 0.4s cubic-bezier(0.34,1.56,0.64,1), transform 0.4s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s ease",
            zIndex: 60,
          }}
        >
          <Image src="/logo.png" alt="Distribuidora Ahorra Max" fill className="object-contain" priority />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-8">
            {NAVBAR_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>
        </div>

        {/* Mobile: hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            className="text-white p-1.5 -mr-1 touch-manipulation"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            style={{ color: "var(--th-text)" }}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          open ? "max-h-72" : "max-h-0"
        )}
        style={{ borderTop: open ? "1px solid rgba(204,0,0,0.35)" : "none" }}
      >
        <nav
          className="flex flex-col px-5 py-3"
          style={{ backgroundColor: "var(--th-nav-bg)", backdropFilter: "blur(12px)" }}
        >
          {NAVBAR_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              className="py-4 text-base border-b border-white/10 last:border-0"
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>
      </div>
    </header>
  )
}
