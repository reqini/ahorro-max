import { redirect } from 'next/navigation'
import { setAdminSession } from '@/lib/admin-auth'

async function loginAction(formData: FormData) {
  'use server'
  const password = formData.get('password') as string
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin'
  if (password === adminPassword) {
    await setAdminSession()
    redirect('/admin/ofertas')
  }
  redirect('/admin/login?error=1')
}

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const hasError = params.error === '1'

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="text-[#CC0000] font-black text-4xl tracking-tight mb-1"
            style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif" }}
          >
            AHORRA MAX
          </div>
          <p className="text-white/40 text-sm">Panel de administración</p>
        </div>

        {/* Form */}
        <div className="border border-white/10 bg-[#0d0d0d] p-6">
          <h1 className="text-white font-semibold text-base mb-5">Ingresar</h1>

          {hasError && (
            <div className="mb-4 px-3 py-2 bg-red-950/50 border border-red-800/50 text-red-400 text-sm">
              Contraseña incorrecta
            </div>
          )}

          <form action={loginAction} className="flex flex-col gap-4">
            <div>
              <label htmlFor="password" className="block text-white/60 text-xs mb-1.5 uppercase tracking-wide">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                className="w-full bg-[#1a1a1a] border border-white/30 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/45"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#CC0000] hover:bg-red-700 text-white font-bold uppercase tracking-wider py-2.5 text-sm transition-colors"
            >
              Ingresar
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">Distribuidora Ahorra Max</p>
      </div>
    </div>
  )
}
