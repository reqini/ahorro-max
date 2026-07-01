import { redirect } from 'next/navigation'
import { setVendorSession } from '@/lib/admin-auth'
import { getVendedorByUsername, verifyPassword } from '@/lib/vendedores'

async function loginAction(formData: FormData) {
  'use server'
  const username = (formData.get('username') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  if (!username || !password) redirect('/vendedor/login?error=1')

  const vendedor = await getVendedorByUsername(username)
  if (vendedor && verifyPassword(password, vendedor.password_hash)) {
    await setVendorSession(vendedor.username)
    redirect('/vendedor/clientes')
  }
  redirect('/vendedor/login?error=1')
}

interface Props { searchParams: Promise<{ error?: string }> }

export default async function VendedorLogin({ searchParams }: Props) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <div className="text-[#CC0000] font-black text-3xl tracking-tight mb-1">AHORRA MAX</div>
          <p className="text-white/40 text-sm">App de Vendedores</p>
        </div>

        <div className="border border-white/20 bg-[#131313] p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs px-2 py-0.5 bg-[#F5C000]/10 text-[#F5C000] border border-[#F5C000]/30 font-bold uppercase tracking-wide">
              Vendedor
            </span>
            <span className="text-white/50 text-sm">Ingresar</span>
          </div>

          {params.error === '1' && (
            <div className="mb-4 px-3 py-2 bg-red-950/50 border border-red-800/50 text-red-400 text-sm">
              Usuario o contraseña incorrectos
            </div>
          )}

          <form action={loginAction} className="flex flex-col gap-4">
            <div>
              <label className="block text-white/60 text-xs mb-1.5 uppercase tracking-wide">
                Usuario
              </label>
              <input
                name="username"
                type="text"
                required
                autoFocus
                autoComplete="username"
                autoCapitalize="off"
                className="w-full bg-[#1a1a1a] border border-white/30 text-white px-3 py-3 text-base focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/30"
                placeholder="pedro"
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1.5 uppercase tracking-wide">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full bg-[#1a1a1a] border border-white/30 text-white px-3 py-3 text-base focus:outline-none focus:border-[#CC0000] transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#CC0000] hover:bg-red-700 text-white font-bold uppercase tracking-wider py-3 text-sm transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
