import Link from 'next/link'
import { redirect } from 'next/navigation'
import { clearAdminSession, getVendedorUsername } from '@/lib/admin-auth'
import { PWA_PRECIOS_URL } from '@/constants/contact'
import { VendedorNav } from './VendedorNav'

async function logoutAction() {
  'use server'
  await clearAdminSession()
  redirect('/login')
}

export default async function VendedorLayout({ children }: { children: React.ReactNode }) {
  const username = await getVendedorUsername()

  // Alto fijo con scroll interno: así el header no se va nunca y las pantallas que
  // ocupan todo el alto (el mapa del recorrido) pueden posicionarse contra `main`
  // sin depender de cuánto mide el header.
  return (
    <div className="h-[100dvh] bg-[#0a0a0a] text-white flex flex-col max-w-2xl mx-auto overflow-hidden">
      <header className="shrink-0 bg-[#0d0d0d] border-b border-white/10">
        <div className="px-4 py-2.5 flex items-center justify-between gap-3">
          <Link href="/vendedor/pedidos" className="text-[#CC0000] font-black text-base tracking-tight">
            AHORRA MAX
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            {username && <span className="text-white/40 text-xs">@{username}</span>}
            <a
              href={PWA_PRECIOS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#F97316] px-2 py-1 border border-[#F97316]/40"
              title="App offline"
            >
              📲
            </a>
            <form action={logoutAction}>
              <button className="text-xs text-white/40 hover:text-white transition-colors px-1.5 py-1">
                Salir
              </button>
            </form>
          </div>
        </div>

        {/* Nav en su propia fila: con 4 secciones no entra al lado del logo en mobile. */}
        <nav className="px-2 pb-2 flex items-center gap-1.5 overflow-x-auto sin-barra">
          <VendedorNav />
        </nav>
      </header>

      <main className="flex-1 relative overflow-y-auto barra-sutil">{children}</main>
    </div>
  )
}
