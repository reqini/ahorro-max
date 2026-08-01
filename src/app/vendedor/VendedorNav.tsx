'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITEMS = [
  { href: '/vendedor/pedidos', label: 'Pedidos' },
  { href: '/vendedor/clientes', label: 'Clientes' },
  { href: '/vendedor/recorridos', label: 'Recorridos' },
  { href: '/vendedor/productos', label: 'Precios' },
]

export function VendedorNav() {
  const pathname = usePathname()

  return (
    <>
      {ITEMS.map((item) => {
        const active = pathname?.startsWith(item.href)
        return (
          <Link key={item.href} href={item.href}
            className={`text-xs px-3 py-1.5 border transition-colors whitespace-nowrap shrink-0 ${
              active
                ? 'bg-[#CC0000]/15 border-[#CC0000]/60 text-white font-semibold'
                : 'text-white/50 border-white/10 hover:text-white hover:border-white/30'
            }`}>
            {item.label}
          </Link>
        )
      })}
    </>
  )
}
