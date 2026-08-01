'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  label: string
  mobileLabel?: string
}

interface NavGroup {
  label: string
  items: NavItem[]
}

// Agrupado por lo que el admin realmente hace: manejar el negocio día a día
// (pedidos, clientes, productos) vs. editar contenido del sitio público.
const GROUPS: NavGroup[] = [
  {
    label: 'Operación',
    items: [
      { href: '/admin/pedidos', label: 'Pedidos' },
      { href: '/admin/clientes', label: 'Lista Digital' },
      { href: '/admin/productos', label: 'Productos' },
      { href: '/admin/precios', label: 'Listas de Precios', mobileLabel: 'Precios' },
      { href: '/admin/vendedores', label: 'Vendedores' },
      { href: '/admin/recorridos', label: 'Recorridos' },
    ],
  },
  {
    label: 'Sitio web',
    items: [
      { href: '/admin/promo', label: '⚡ Promo Relámpago', mobileLabel: '⚡ Promo' },
      { href: '/admin/ofertas', label: 'Ofertas' },
      { href: '/admin/faqs', label: 'Preguntas Frecuentes', mobileLabel: 'FAQ' },
      { href: '/admin/zonas', label: 'Zonas de Entrega', mobileLabel: 'Zonas' },
      { href: '/admin/config', label: 'Teléfono & WhatsApp', mobileLabel: 'WhatsApp' },
    ],
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar (desktop) */}
      <nav className="hidden md:flex flex-col w-52 border-r border-white/10 bg-[#0d0d0d] py-6 px-3 gap-4 shrink-0">
        {GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <p className="px-3 pb-1 text-white/25 text-[10px] font-bold uppercase tracking-widest">
              {group.label}
            </p>
            {group.items.map((item) => (
              <NavLink key={item.href} href={item.href} active={pathname?.startsWith(item.href)}>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Mobile horizontal nav */}
      <div className="md:hidden w-full border-b border-white/10 bg-[#0d0d0d] px-4 py-2 flex items-center gap-1 overflow-x-auto sin-barra shrink-0 fixed top-[53px] left-0 z-10">
        {GROUPS.map((group, i) => (
          <div key={group.label} className="flex items-center gap-1">
            {i > 0 && <span className="text-white/15 mx-1">|</span>}
            {group.items.map((item) => (
              <MobileNavLink key={item.href} href={item.href} active={pathname?.startsWith(item.href)}>
                {item.mobileLabel ?? item.label}
              </MobileNavLink>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

function NavLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 text-sm transition-colors rounded-sm ${
        active ? 'bg-[#CC0000]/15 text-white border-l-2 border-[#CC0000] pl-2.5' : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 text-xs transition-colors whitespace-nowrap rounded-sm ${
        active ? 'bg-[#CC0000]/15 text-white font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  )
}
