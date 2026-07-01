import { redirect } from 'next/navigation'
import { setAdminSession } from '@/lib/admin-auth'
import { PasswordInput } from '@/components/ui/PasswordInput'

async function loginAction(formData: FormData) {
  'use server'
  const username = (formData.get('username') as string)?.trim().toLowerCase()
  const password = (formData.get('password') as string) ?? ''

  const validUser = process.env.ADMIN_USERNAME ?? 'admin'
  const validPass = process.env.ADMIN_PASSWORD ?? 'admin'

  if (username === validUser && password === validPass) {
    await setAdminSession()
    redirect('/admin/ofertas')
  }

  redirect('/admin/login?error=1')
}

interface Props { searchParams: Promise<{ error?: string }> }

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="text-[#CC0000] font-black text-4xl tracking-tight mb-1">
            AHORRA MAX
          </div>
          <p className="text-white/40 text-sm">Panel de administración</p>
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
                Usuario
              </label>
              <input
                name="username"
                type="text"
                required
                autoFocus
                autoCapitalize="off"
                autoComplete="username"
                className="w-full bg-[#1a1a1a] border border-white/20 text-white px-3 py-3 text-base focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/25"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">
                Contraseña
              </label>
              <PasswordInput name="password" required />
            </div>

            <button
              type="submit"
              className="w-full bg-[#CC0000] hover:bg-red-700 text-white font-bold uppercase tracking-wider py-3 text-sm transition-colors mt-1"
            >
              Ingresar al panel
            </button>
          </form>
        </div>

        <div className="mt-5 text-center">
          <a href="/vendedor/login" className="text-xs text-white/20 hover:text-white/40 transition-colors">
            ¿Sos vendedor? Ingresá acá
          </a>
        </div>

      </div>
    </div>
  )
}
