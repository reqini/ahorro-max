import { redirect } from 'next/navigation'
import Link from 'next/link'
import { clearAdminSession } from '@/lib/admin-auth'

async function logoutAction() {
  'use server'
  await clearAdminSession()
  redirect('/admin/login')
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Top bar / sidebar header */}
      <header className="border-b border-white/10 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="text-[#CC0000] font-black text-lg tracking-tight"
              style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif" }}
            >
              AHORRA MAX
            </span>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="text-white/50 text-sm hidden sm:inline">Panel Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs px-3 py-1.5 border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
            >
              ← Volver al sitio
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-xs px-3 py-1.5 bg-white/5 border border-white/20 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar nav */}
        <nav className="hidden md:flex flex-col w-52 border-r border-white/10 bg-[#0d0d0d] py-6 px-3 gap-1 shrink-0">
          <NavLink href="/admin/promo">⚡ Promo Relámpago</NavLink>
          <NavLink href="/admin/ofertas">Ofertas</NavLink>
          <NavLink href="/admin/faqs">Preguntas Frecuentes</NavLink>
          <NavLink href="/admin/productos">Productos</NavLink>
          <NavLink href="/admin/clientes">Lista Digital</NavLink>
          <NavLink href="/admin/vendedores">Vendedores</NavLink>
          <NavLink href="/admin/zonas">Zonas de Entrega</NavLink>
          <NavLink href="/admin/config">Teléfono & WhatsApp</NavLink>
          <NavLink href="/admin/precios">Listas de Precios</NavLink>
        </nav>

        {/* Mobile horizontal nav */}
        <div className="md:hidden w-full border-b border-white/10 bg-[#0d0d0d] px-4 py-2 flex gap-1 overflow-x-auto shrink-0 fixed top-[53px] left-0 z-10">
          <MobileNavLink href="/admin/promo">⚡ Promo</MobileNavLink>
          <MobileNavLink href="/admin/ofertas">Ofertas</MobileNavLink>
          <MobileNavLink href="/admin/faqs">FAQ</MobileNavLink>
          <MobileNavLink href="/admin/productos">Productos</MobileNavLink>
          <MobileNavLink href="/admin/clientes">Clientes</MobileNavLink>
          <MobileNavLink href="/admin/vendedores">Vendedores</MobileNavLink>
          <MobileNavLink href="/admin/zonas">Zonas</MobileNavLink>
          <MobileNavLink href="/admin/config">WhatsApp</MobileNavLink>
          <MobileNavLink href="/admin/precios">Precios</MobileNavLink>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 mt-10 md:mt-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors rounded-sm"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap"
    >
      {children}
    </Link>
  )
}
