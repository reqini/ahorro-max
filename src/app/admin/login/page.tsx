import { redirect } from 'next/navigation'
import { setAdminSession, setVendorSession } from '@/lib/admin-auth'
import { getVendedorByUsername, verifyPassword } from '@/lib/vendedores'

async function loginAction(formData: FormData) {
  'use server'
  const username = (formData.get('username') as string)?.trim().toLowerCase()
  const password = (formData.get('password') as string) ?? ''

  // Admin: solo contraseña
  if (password === (process.env.ADMIN_PASSWORD ?? 'admin')) {
    await setAdminSession()
    redirect('/admin/ofertas')
  }

  // Vendedor: usuario + contraseña
  if (username) {
    const vendedor = await getVendedorByUsername(username)
    if (vendedor && verifyPassword(password, vendedor.password_hash)) {
      await setVendorSession(vendedor.username)
      redirect('/vendedor/clientes')
    }
  }

  redirect('/admin/login?error=1')
}

interface Props { searchParams: Promise<{ error?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams

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
          <p className="text-white/40 text-sm">Distribuidora · Panel de acceso</p>
        </div>

        <div className="border border-white/20 bg-[#131313] p-6 shadow-xl shadow-black/60">

          {params.error === '1' && (
            <div className="mb-5 px-3 py-2.5 bg-red-950/50 border border-red-800/50 text-red-400 text-sm">
              Usuario o contraseña incorrectos
            </div>
          )}

          <form action={loginAction} className="flex flex-col gap-4">
            <div>
              <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">
                Usuario <span className="text-white/25 normal-case">(solo vendedores)</span>
              </label>
              <input
                name="username"
                type="text"
                autoCapitalize="off"
                autoComplete="username"
                className="w-full bg-[#1a1a1a] border border-white/20 text-white px-3 py-3 text-base focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/25"
                placeholder="pedro"
              />
            </div>

            <div>
              <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                className="w-full bg-[#1a1a1a] border border-white/20 text-white px-3 py-3 text-base focus:outline-none focus:border-[#CC0000] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#CC0000] hover:bg-red-700 text-white font-bold uppercase tracking-wider py-3 text-sm transition-colors mt-1"
            >
              Ingresar
            </button>
          </form>
        </div>

        <div className="mt-5 flex justify-center gap-6 text-xs text-white/20">
          <span>Admin → solo contraseña</span>
          <span>·</span>
          <span>Vendedor → usuario + contraseña</span>
        </div>

      </div>
    </div>
  )
}
