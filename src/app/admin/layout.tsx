import { redirect } from 'next/navigation'
import Link from 'next/link'
import { clearAdminSession } from '@/lib/admin-auth'
import { AdminNav } from './AdminNav'

async function logoutAction() {
  'use server'
  await clearAdminSession()
  redirect('/login')
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Top bar / sidebar header */}
      <header className="border-b border-white/10 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[#CC0000] font-black text-lg tracking-tight">
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
        <AdminNav />

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 mt-10 md:mt-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
