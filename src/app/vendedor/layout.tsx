import Link from 'next/link'
import { redirect } from 'next/navigation'
import { clearAdminSession, getVendedorUsername } from '@/lib/admin-auth'
import { PWA_PRECIOS_URL } from '@/constants/contact'

async function logoutAction() {
  'use server'
  await clearAdminSession()
  redirect('/login')
}

export default async function VendedorLayout({ children }: { children: React.ReactNode }) {
  const username = await getVendedorUsername()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col max-w-2xl mx-auto">
      <header className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/vendedor/pedidos" className="text-[#CC0000] font-black text-lg tracking-tight">
          AHORRA MAX
        </Link>
        <div className="flex items-center gap-2">
          {username && (
            <span className="text-white/40 text-xs hidden sm:inline">@{username}</span>
          )}
          <Link href="/vendedor/pedidos"
            className="text-xs text-white/50 hover:text-white px-2.5 py-1.5 border border-white/10 hover:border-white/30 transition-colors">
            Pedidos
          </Link>
          <Link href="/vendedor/clientes"
            className="text-xs text-white/50 hover:text-white px-2.5 py-1.5 border border-white/10 hover:border-white/30 transition-colors">
            Clientes
          </Link>
          <Link href="/vendedor/productos"
            className="text-xs text-white/50 hover:text-white px-2.5 py-1.5 border border-white/10 hover:border-white/30 transition-colors">
            Precios
          </Link>
          <a href={PWA_PRECIOS_URL} target="_blank" rel="noopener noreferrer"
            className="text-xs text-[#F97316] hover:text-orange-300 px-2.5 py-1.5 border border-[#F97316]/40 hover:border-[#F97316] transition-colors">
            📲 App offline
          </a>
          <form action={logoutAction}>
            <button className="text-xs text-white/30 hover:text-white transition-colors px-2 py-1.5">
              Salir
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 pb-6">
        {children}
      </main>
    </div>
  )
}
