import { getZonasEntrega } from '@/lib/zonas'
import { addZona, deleteZona } from './actions'
import { DeleteButton } from '../components/DeleteButton'

interface PageProps {
  searchParams: Promise<{ added?: string }>
}

export default async function ZonasPage({ searchParams }: PageProps) {
  const [zonas, params] = await Promise.all([getZonasEntrega(), searchParams])
  const added = params.added === '1'

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-2">Zonas de Entrega</h1>
      <p className="text-white/40 text-sm mb-6">Las zonas aparecen en la sección "Entrega sin cargo" del sitio.</p>

      {added && (
        <div className="mb-5 px-4 py-3 bg-green-950/40 border border-green-700/40 text-green-400 text-sm">
          Zona agregada correctamente.
        </div>
      )}

      {/* Lista actual */}
      <div className="border border-white/20 bg-[#131313] shadow-xl shadow-black/60 mb-6">
        <div className="px-5 py-3 border-b border-white/10">
          <span className="text-white/60 text-xs uppercase tracking-wide font-bold">
            Zonas activas ({zonas.length})
          </span>
        </div>

        {zonas.length === 0 ? (
          <p className="px-5 py-6 text-white/30 text-sm text-center">Sin zonas. Agregá una abajo.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {zonas.map((zona) => (
              <div key={zona} className="flex items-center justify-between px-5 py-3.5 gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5C000] shrink-0" />
                  <span className="text-white text-sm font-medium">{zona}</span>
                </div>
                <DeleteButton
                  action={deleteZona.bind(null, zona)}
                  label={`¿Eliminar zona "${zona}"?`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agregar zona */}
      <div className="border border-white/20 bg-[#131313] shadow-xl shadow-black/60 p-5">
        <h2 className="text-white/75 text-xs uppercase tracking-wide font-bold mb-4">Agregar zona</h2>
        <form action={addZona} className="flex gap-3">
          <input
            name="nombre"
            required
            placeholder="Ej: Morón, Haedo, Castelar..."
            className="flex-1 bg-[#1a1a1a] border border-white/30 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/45"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#CC0000] hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            + Agregar
          </button>
        </form>
      </div>
    </div>
  )
}
