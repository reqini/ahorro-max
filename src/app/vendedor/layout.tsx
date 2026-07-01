import Link from 'next/link'
import { redirect } from 'next/navigation'
import { clearAdminSession } from '@/lib/admin-auth'

async function logoutAction() {
  'use server'
  await clearAdminSession()
  redirect('/vendedor/login')
}

export default function VendedorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/vendedor/clientes" className="text-[#CC0000] font-black text-lg tracking-tight">
          AHORRA MAX
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/vendedor/clientes"
            className="text-xs text-white/50 hover:text-white px-3 py-1.5 border border-white/10 hover:border-white/30 transition-colors"
          >
            Clientes
          </Link>
          <form action={logoutAction}>
            <button className="text-xs text-white/40 hover:text-white transition-colors px-2 py-1.5">
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
