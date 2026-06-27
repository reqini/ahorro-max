import { getSupabaseAdmin } from '@/lib/supabase'
import type { Sucursal } from '@/types/database'
import { addSucursal, deleteSucursal, toggleSucursalActiva } from './actions'
import { EditSucursalForm } from './EditSucursalForm'

export default async function SucursalesPage() {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase.from('sucursales').select('*').order('orden')
  const sucursales: Sucursal[] = data ?? []

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">Sucursales</h1>

      {/* List */}
      <div className="flex flex-col gap-4 mb-8">
        {sucursales.length === 0 && (
          <p className="text-white/30 text-sm border border-white/10 px-4 py-6 text-center">
            Sin sucursales. Agregá una abajo.
          </p>
        )}
        {sucursales.map((s) => (
          <div key={s.id} className={`border border-white/10 bg-[#0d0d0d] p-4 ${!s.activa ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-semibold text-sm">{s.nombre}</p>
                  {!s.activa && (
                    <span className="text-xs px-1.5 py-0.5 bg-white/10 text-white/40">Inactiva</span>
                  )}
                </div>
                <p className="text-white/50 text-xs mt-1">{s.direccion}</p>
                {s.telefono && <p className="text-white/40 text-xs mt-0.5">Tel: {s.telefono}</p>}
                {s.horarios && <p className="text-white/40 text-xs mt-0.5">Horarios: {s.horarios}</p>}
                {s.maps_url && (
                  <a href={s.maps_url} target="_blank" rel="noopener noreferrer" className="text-[#F5C000] text-xs mt-0.5 hover:underline inline-block">
                    Ver en Maps →
                  </a>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <form action={toggleSucursalActiva.bind(null, s.id, s.activa)}>
                  <button
                    type="submit"
                    className={`text-xs px-2 py-1 border transition-colors ${
                      s.activa
                        ? 'border-green-700/50 text-green-400 hover:bg-green-950/30'
                        : 'border-white/20 text-white/40 hover:bg-white/5'
                    }`}
                  >
                    {s.activa ? 'ON' : 'OFF'}
                  </button>
                </form>
                <form action={deleteSucursal.bind(null, s.id)}>
                  <button
                    type="submit"
                    className="text-xs px-2 py-1 border border-red-900/50 text-red-500/70 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </form>
              </div>
            </div>
            <EditSucursalForm sucursal={s} />
          </div>
        ))}
      </div>

      {/* Add form */}
      <div className="border border-white/10 bg-[#0d0d0d] p-5">
        <h2 className="text-white/60 text-sm font-semibold uppercase tracking-wide mb-4">Agregar sucursal</h2>
        <form action={addSucursal} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-white/40 text-xs block mb-1">Nombre *</label>
              <input
                name="nombre"
                required
                placeholder="Ej: Sucursal Ciudadela"
                className="w-full bg-black border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40 placeholder-white/25"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">Dirección *</label>
              <input
                name="direccion"
                required
                placeholder="Ej: 25 de mayo 108, Ciudadela"
                className="w-full bg-black border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40 placeholder-white/25"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">Teléfono</label>
              <input
                name="telefono"
                placeholder="Ej: 11 5020-3114"
                className="w-full bg-black border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40 placeholder-white/25"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">Horarios</label>
              <input
                name="horarios"
                placeholder="Ej: Lun-Vie 8-18hs"
                className="w-full bg-black border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40 placeholder-white/25"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-white/40 text-xs block mb-1">URL de Google Maps</label>
              <input
                name="maps_url"
                placeholder="https://maps.google.com/..."
                className="w-full bg-black border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40 placeholder-white/25"
              />
            </div>
          </div>
          <button
            type="submit"
            className="self-start px-6 py-2 bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            + Agregar sucursal
          </button>
        </form>
      </div>
    </div>
  )
}
