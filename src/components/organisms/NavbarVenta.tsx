'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

/** Navbar enfocada en la venta: el botón "Comprar" está siempre a la vista. */
export function NavbarVenta() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(10,10,10,0.92)' : 'rgba(10,10,10,0.4)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(204,0,0,0.5)' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" aria-label="Inicio" className="flex items-center gap-2 shrink-0">
          <Image src="/logo.png" alt="Distribuidora Ahorra Max" width={44} height={44} className="w-10 h-10 object-contain" priority />
          <span className="text-white font-black text-sm tracking-tight hidden sm:block">
            AHORRA <span className="text-[#CC0000]">MAX</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#mayorista"
            className="text-white/55 hover:text-[#F5C000] text-xs sm:text-sm transition-colors px-2 py-1.5"
          >
            Mayorista
          </a>
          <Link
            href="/catalogo"
            className="bg-[#CC0000] hover:bg-red-700 text-white text-xs sm:text-sm font-bold uppercase tracking-wide px-4 py-2.5 transition-colors flex items-center gap-1.5"
          >
            🛒 Comprar
          </Link>
        </div>
      </div>
    </header>
  )
}
