import { getSiteConfig } from '@/lib/config'
import { saveConfig } from './actions'

interface ConfigPageProps {
  searchParams: Promise<{ saved?: string }>
}

export default async function ConfigPage({ searchParams }: ConfigPageProps) {
  const [config, params] = await Promise.all([getSiteConfig(), searchParams])
  const saved = params.saved === '1'

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">Teléfono & WhatsApp</h1>

      {saved && (
        <div className="mb-5 px-4 py-3 bg-green-950/40 border border-green-700/40 text-green-400 text-sm">
          Configuración guardada correctamente.
        </div>
      )}

      <div className="border border-white/10 bg-[#0d0d0d] p-5 max-w-xl">
        <form action={saveConfigWithRedirect} className="flex flex-col gap-5">
          <div>
            <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">
              Teléfono de display
            </label>
            <input
              name="telefono"
              defaultValue={config.telefono ?? ''}
              placeholder="Ej: 11 5020-3114"
              className="w-full bg-black border border-white/20 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/25"
            />
            <p className="text-white/30 text-xs mt-1">Este número se muestra en el sitio como texto.</p>
          </div>

          <div>
            <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">
              Número WhatsApp (sin espacios ni +)
            </label>
            <input
              name="whatsapp_number"
              defaultValue={config.whatsapp_number ?? ''}
              placeholder="Ej: 5491150203114"
              pattern="[0-9]+"
              className="w-full bg-black border border-white/20 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/25"
            />
            <p className="text-white/30 text-xs mt-1">Formato: código país + código área + número. Ej: 5491150203114</p>
          </div>

          <div>
            <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">
              Mensaje WhatsApp — Minorista
            </label>
            <textarea
              name="whatsapp_msg_minorista"
              defaultValue={config.whatsapp_msg_minorista ?? ''}
              rows={3}
              className="w-full bg-black border border-white/20 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/25 resize-none"
            />
          </div>

          <div>
            <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">
              Mensaje WhatsApp — Mayorista
            </label>
            <textarea
              name="whatsapp_msg_mayorista"
              defaultValue={config.whatsapp_msg_mayorista ?? ''}
              rows={3}
              className="w-full bg-black border border-white/20 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/25 resize-none"
            />
          </div>

          <button
            type="submit"
            className="self-start px-6 py-2.5 bg-[#CC0000] hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wider transition-colors"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  )
}

async function saveConfigWithRedirect(formData: FormData) {
  'use server'
  const { redirect } = await import('next/navigation')
  await saveConfig(formData)
  redirect('/admin/config?saved=1')
}
