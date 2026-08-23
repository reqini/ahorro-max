import { getZonasDetalle, getMayoristaMinMonto } from '@/lib/zonas'
import { saveMinimoMonto, addZonaRegion, updateZonaRegion, deleteZonaRegion } from './actions'
import { DeleteButton } from '../components/DeleteButton'

interface PageProps {
  searchParams: Promise<{ added?: string }>
}

const inputClass =
  'w-full bg-[#1a1a1a] border border-white/30 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/45'

export default async function ZonasPage({ searchParams }: PageProps) {
  const [zonas, minimoMonto, params] = await Promise.all([getZonasDetalle(), getMayoristaMinMonto(), searchParams])
  const added = params.added === '1'

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-2">Zonas de Entrega y Mínimo Mayorista</h1>
      <p className="text-white/40 text-sm mb-6">
        Se muestran en la sección &quot;Entrega sin cargo&quot; del sitio y en las landings mayoristas.
      </p>

      {added && (
        <div className="mb-5 px-4 py-3 bg-green-950/40 border border-green-700/40 text-green-400 text-sm">
          Región agregada correctamente.
        </div>
      )}

      {/* Mínimo de compra mayorista */}
      <div className="border border-white/20 bg-[#131313] shadow-xl shadow-black/60 p-5 mb-6">
        <h2 className="text-white/75 text-xs uppercase tracking-wide font-bold mb-4">Mínimo de compra mayorista</h2>
        <form action={saveMinimoMonto} className="flex gap-3">
          <input name="monto" required defaultValue={minimoMonto} placeholder="Ej: $300.000" className={inputClass} />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#CC0000] hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            Guardar
          </button>
        </form>
      </div>

      {/* Regiones */}
      <div className="flex flex-col gap-4 mb-6">
        {zonas.length === 0 ? (
          <p className="border border-white/20 bg-[#131313] px-5 py-6 text-white/30 text-sm text-center">
            Sin zonas. Agregá una abajo.
          </p>
        ) : (
          zonas.map((zona) => (
            <div key={zona.region} className="border border-white/20 bg-[#131313] shadow-xl shadow-black/60 p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-white/60 text-xs uppercase tracking-wide font-bold">{zona.region}</span>
                <DeleteButton
                  action={deleteZonaRegion.bind(null, zona.region)}
                  label={`¿Eliminar la región "${zona.region}"?`}
                />
              </div>
              <form action={updateZonaRegion.bind(null, zona.region)} className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/75 text-xs uppercase tracking-wide block mb-1.5 font-medium">Región</label>
                    <input name="region" required defaultValue={zona.region} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-white/75 text-xs uppercase tracking-wide block mb-1.5 font-medium">Días de entrega</label>
                    <input name="dias" required defaultValue={zona.dias} placeholder="Ej: Miércoles y Sábado" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="text-white/75 text-xs uppercase tracking-wide block mb-1.5 font-medium">
                    Barrios (separados por coma)
                  </label>
                  <textarea name="barrios" required defaultValue={zona.barrios.join(', ')} rows={2} className={`${inputClass} resize-none`} />
                </div>
                <button
                  type="submit"
                  className="self-start px-5 py-2 bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Guardar región
                </button>
              </form>
            </div>
          ))
        )}
      </div>

      {/* Agregar región */}
      <div className="border border-white/20 bg-[#131313] shadow-xl shadow-black/60 p-5">
        <h2 className="text-white/75 text-xs uppercase tracking-wide font-bold mb-4">Agregar región</h2>
        <form action={addZonaRegion} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="region" required placeholder="Región (ej: Zona Sur)" className={inputClass} />
            <input name="dias" required placeholder="Días de entrega (ej: Lunes y Jueves)" className={inputClass} />
          </div>
          <textarea name="barrios" required placeholder="Barrios separados por coma (ej: Castelar, Ituzaingó)" rows={2} className={`${inputClass} resize-none`} />
          <button
            type="submit"
            className="self-start px-5 py-2.5 bg-[#CC0000] hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wider transition-colors"
          >
            + Agregar región
          </button>
        </form>
      </div>
    </div>
  )
}
