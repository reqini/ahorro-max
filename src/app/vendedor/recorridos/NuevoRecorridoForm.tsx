'use client'

import { useActionState, useMemo, useState } from 'react'
import type { ZonaResumen } from '@/lib/direcciones'
import { crearRecorridoAction } from './actions'

const MAX_LISTA = 60

export function NuevoRecorridoForm({ zonas }: { zonas: ZonaResumen[] }) {
  const [abierto, setAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [elegidas, setElegidas] = useState<string[]>([])
  const [state, action, pending] = useActionState(crearRecorridoAction, null)

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    const base = q
      ? zonas.filter((z) => z.zona.toLowerCase().includes(q) || z.partido.toLowerCase().includes(q))
      : zonas
    // Sin búsqueda conviene mostrar primero las zonas listas para caminar.
    return q ? base : [...base].sort((a, b) => b.geocodificadas - a.geocodificadas)
  }, [zonas, busqueda])

  const seleccion = useMemo(
    () => zonas.filter((z) => elegidas.includes(z.zona)),
    [zonas, elegidas]
  )
  const totalUbicadas = seleccion.reduce((a, z) => a + z.geocodificadas, 0)
  const totalDirecciones = seleccion.reduce((a, z) => a + z.total, 0)

  function toggle(zona: string) {
    setElegidas((prev) => (prev.includes(zona) ? prev.filter((z) => z !== zona) : [...prev, zona]))
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="w-full px-4 py-3 bg-[#CC0000] hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wider transition-colors"
      >
        + Nuevo recorrido
      </button>
    )
  }

  return (
    <form action={action} className="border border-white/15 bg-[#111] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-sm">Nuevo recorrido</h2>
        <button
          type="button"
          onClick={() => setAbierto(false)}
          className="text-white/35 hover:text-white text-xs transition-colors"
        >
          Cancelar
        </button>
      </div>

      {/* Zonas elegidas */}
      <div>
        <label className="block text-white/50 text-xs uppercase tracking-wide font-bold mb-2">
          Zonas {elegidas.length > 0 && <span className="text-white/30 normal-case">({elegidas.length})</span>}
        </label>

        {seleccion.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {seleccion.map((z) => (
              <button
                key={z.zona}
                type="button"
                onClick={() => toggle(z.zona)}
                className="text-xs px-2 py-1 bg-[#CC0000]/15 border border-[#CC0000]/50 text-white transition-colors hover:bg-[#CC0000]/25"
              >
                {z.zona} ✕
              </button>
            ))}
          </div>
        )}

        {elegidas.map((z) => (
          <input key={z} type="hidden" name="zonas" value={z} />
        ))}

        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar barrio, localidad o partido..."
          className="w-full bg-[#1a1a1a] border border-white/25 text-white text-sm px-3 py-2 mb-2 focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/35"
        />

        <div className="max-h-56 overflow-y-auto border border-white/10 divide-y divide-white/5">
          {filtradas.length === 0 ? (
            <p className="px-3 py-4 text-white/30 text-xs text-center">
              {zonas.length === 0
                ? 'Todavía no hay direcciones cargadas. Pedile al admin que importe el padrón.'
                : 'Ninguna zona coincide.'}
            </p>
          ) : (
            filtradas.slice(0, MAX_LISTA).map((z) => {
              const activa = elegidas.includes(z.zona)
              return (
                <button
                  key={z.zona}
                  type="button"
                  onClick={() => toggle(z.zona)}
                  className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors ${
                    activa ? 'bg-[#CC0000]/10' : 'hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`w-4 h-4 border shrink-0 flex items-center justify-center text-[10px] ${
                      activa ? 'bg-[#CC0000] border-[#CC0000] text-white' : 'border-white/30'
                    }`}
                  >
                    {activa ? '✓' : ''}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-white text-sm truncate">{z.zona}</span>
                    <span className="block text-white/30 text-[11px]">
                      {z.partido && z.partido !== z.zona ? `${z.partido} · ` : ''}
                      {z.total} direcciones · {z.geocodificadas} ubicadas
                    </span>
                  </span>
                </button>
              )
            })
          )}
        </div>

        {filtradas.length > MAX_LISTA && (
          <p className="text-white/25 text-[11px] mt-1.5">
            Se muestran {MAX_LISTA} de {filtradas.length} zonas. Usá el buscador para encontrar el resto.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wide font-bold mb-2">Nombre</label>
          <input
            name="nombre"
            placeholder="Opcional"
            className="w-full bg-[#1a1a1a] border border-white/25 text-white text-sm px-3 py-2 focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/35"
          />
        </div>
        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wide font-bold mb-2">Paradas</label>
          <select
            name="max_paradas"
            defaultValue="40"
            className="w-full bg-[#1a1a1a] border border-white/25 text-white text-sm px-3 py-2 focus:outline-none focus:border-[#CC0000] transition-colors"
          >
            {[20, 30, 40, 60, 80, 120].map((n) => (
              <option key={n} value={n}>{n} paradas</option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          name="solo_geocodificadas"
          defaultChecked
          className="mt-0.5 accent-[#CC0000]"
        />
        <span className="text-white/50 text-xs">
          Solo direcciones ubicadas en el mapa.
          <span className="block text-white/25 mt-0.5">
            Si lo destildás también entran las que no se pudieron ubicar, ordenadas por calle y altura al final.
          </span>
        </span>
      </label>

      {seleccion.length > 0 && (
        <p className="text-white/40 text-xs">
          {totalDirecciones} direcciones en {seleccion.length} zona{seleccion.length !== 1 ? 's' : ''} ·{' '}
          <span className={totalUbicadas === 0 ? 'text-amber-400' : 'text-green-400'}>
            {totalUbicadas} ubicadas en el mapa
          </span>
        </p>
      )}

      {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}

      <button
        type="submit"
        disabled={pending || elegidas.length === 0}
        className="w-full px-4 py-3 bg-[#CC0000] hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-40"
      >
        {pending ? 'Armando recorrido...' : 'Armar recorrido'}
      </button>
    </form>
  )
}
