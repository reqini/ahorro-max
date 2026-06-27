import { getSupabaseAdmin } from '@/lib/supabase'
import type { Oferta } from '@/types/database'
import { addOferta, deleteOferta, toggleOfertaActiva } from './actions'
import { DeleteButton } from '../components/DeleteButton'

interface PageProps {
  searchParams: Promise<{ added?: string }>
}

export default async function OfertasPage({ searchParams }: PageProps) {
  const [{ data }, params] = await Promise.all([
    getSupabaseAdmin().from('ofertas').select('*').order('orden'),
    searchParams,
  ])

  const ofertas: Oferta[] = data ?? []
  const minoristas = ofertas.filter((o) => o.tipo === 'minorista')
  const mayoristas = ofertas.filter((o) => o.tipo === 'mayorista')
  const added = params.added === '1'

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">Ofertas</h1>

      {added && (
        <div className="mb-5 px-4 py-3 bg-green-950/40 border border-green-700/40 text-green-400 text-sm">
          Oferta agregada correctamente.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OfertasColumn tipo="minorista" label="Minorista" color="red" items={minoristas} />
        <OfertasColumn tipo="mayorista" label="Mayorista" color="yellow" items={mayoristas} />
      </div>
    </div>
  )
}

async function addOfertaWithRedirect(formData: FormData) {
  'use server'
  const { redirect } = await import('next/navigation')
  await addOferta(formData)
  redirect('/admin/ofertas?added=1')
}

function OfertasColumn({
  tipo,
  label,
  color,
  items,
}: {
  tipo: 'minorista' | 'mayorista'
  label: string
  color: 'red' | 'yellow'
  items: Oferta[]
}) {
  const accent = color === 'red' ? '#CC0000' : '#F5C000'
  const borderColor = color === 'red' ? 'border-[#CC0000]/40' : 'border-[#F5C000]/40'
  const headerBg = color === 'red' ? 'bg-[#CC0000]/10' : 'bg-[#F5C000]/10'
  const headerBorder = color === 'red' ? 'border-[#CC0000]/30' : 'border-[#F5C000]/30'
  const labelColor = color === 'red' ? 'text-[#CC0000]' : 'text-[#F5C000]'

  return (
    <div className={`border ${borderColor} bg-black/30`}>
      <div className={`px-4 py-3 border-b ${headerBorder} ${headerBg}`}>
        <span className={`${labelColor} font-black uppercase tracking-wider text-sm`}>{label}</span>
        <span className="text-white/40 text-xs ml-2">({items.length} ofertas)</span>
      </div>

      <div className="divide-y divide-white/5">
        {items.length === 0 && (
          <p className="px-4 py-6 text-white/30 text-sm text-center">Sin ofertas. Agregá una abajo.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className={`flex items-start gap-3 px-4 py-3 ${!item.activa ? 'opacity-50' : ''}`}>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{item.nombre}</p>
              {item.detalle && <p className="text-white/50 text-xs mt-0.5">{item.detalle}</p>}
              <p style={{ color: accent }} className="text-xs font-bold mt-0.5">{item.precio}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <form action={toggleOfertaActiva.bind(null, item.id, item.activa)}>
                <button
                  type="submit"
                  title={item.activa ? 'Desactivar' : 'Activar'}
                  className={`text-xs px-2 py-1 border transition-colors ${
                    item.activa
                      ? 'border-green-700/50 text-green-400 hover:bg-green-950/30'
                      : 'border-white/20 text-white/40 hover:bg-white/5'
                  }`}
                >
                  {item.activa ? 'ON' : 'OFF'}
                </button>
              </form>
              <DeleteButton
                action={deleteOferta.bind(null, item.id)}
                label={`¿Eliminar "${item.nombre}"?`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={`border-t ${headerBorder} px-4 py-4 bg-black/20`}>
        <p className="text-white/40 text-xs uppercase tracking-wide mb-3">Agregar oferta</p>
        <form action={addOfertaWithRedirect} className="flex flex-col gap-2">
          <input type="hidden" name="tipo" value={tipo} />
          <input
            name="nombre"
            required
            placeholder="Nombre del producto *"
            className="w-full bg-black border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40 placeholder-white/25"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              name="detalle"
              placeholder="Detalle (ej: Pack x6)"
              className="bg-black border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40 placeholder-white/25"
            />
            <input
              name="precio"
              placeholder="Precio (def: Consultá)"
              className="bg-black border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40 placeholder-white/25"
            />
          </div>
          <button
            type="submit"
            style={{ backgroundColor: accent }}
            className="w-full py-2 text-xs font-bold uppercase tracking-wider text-black hover:opacity-90 transition-opacity"
          >
            + Agregar
          </button>
        </form>
      </div>
    </div>
  )
}
