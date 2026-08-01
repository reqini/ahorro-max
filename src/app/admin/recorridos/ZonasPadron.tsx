'use client'

import { useMemo, useState } from 'react'
import type { ZonaResumen } from '@/lib/direcciones'
import { DeleteButton } from '../components/DeleteButton'
import { borrarZona, reintentarFallidas } from './actions'
import { GeocodePanel } from './GeocodePanel'

const POR_PAGINA = 40

export function ZonasPadron({ zonas }: { zonas: ZonaResumen[] }) {
  const [busqueda, setBusqueda] = useState('')
  const [visibles, setVisibles] = useState(POR_PAGINA)

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return zonas
    return zonas.filter((z) => z.zona.toLowerCase().includes(q) || z.partido.toLowerCase().includes(q))
  }, [zonas, busqueda])

  return (
    <div className="border border-white/20 bg-[#131313] shadow-xl shadow-black/60">
      <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-white/60 text-xs uppercase tracking-wide font-bold">
          Zonas del padrón ({zonas.length})
        </span>
        <input
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value)
            setVisibles(POR_PAGINA)
          }}
          placeholder="Buscar zona o partido..."
          className="bg-[#1a1a1a] border border-white/20 text-white text-xs px-3 py-1.5 focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/35 w-52"
        />
      </div>

      {filtradas.length === 0 ? (
        <p className="px-5 py-8 text-white/30 text-sm text-center">
          {zonas.length === 0 ? 'Todavía no importaste ningún padrón.' : 'Ninguna zona coincide con la búsqueda.'}
        </p>
      ) : (
        <>
          <div className="divide-y divide-white/5">
            {filtradas.slice(0, visibles).map((z) => {
              const pendientes = z.total - z.geocodificadas - z.fallidas
              const pct = z.total > 0 ? Math.round((z.geocodificadas / z.total) * 100) : 0

              return (
                <div key={z.zona} className="px-5 py-3.5 flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-[160px]">
                    <p className="text-white text-sm font-medium">{z.zona}</p>
                    <p className="text-white/30 text-xs mt-0.5">
                      {z.partido && z.partido !== z.zona ? `${z.partido} · ` : ''}
                      {z.total} direccion{z.total !== 1 ? 'es' : ''}
                    </p>
                  </div>

                  <div className="w-32 shrink-0">
                    <div className="h-1.5 bg-white/10 overflow-hidden">
                      <div className="h-full bg-green-500/70" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[11px] text-white/35 mt-1">
                      {z.geocodificadas}/{z.total} ubicadas
                      {z.fallidas > 0 && <span className="text-amber-400/70"> · {z.fallidas} sin resultado</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {pendientes > 0 && <GeocodePanel pendientes={pendientes} zona={z.zona} compacto />}
                    {pendientes === 0 && z.fallidas > 0 && (
                      <form action={reintentarFallidas.bind(null, z.zona)}>
                        <button className="text-xs px-3 py-1.5 border border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors">
                          ↻ Reintentar {z.fallidas}
                        </button>
                      </form>
                    )}
                    <DeleteButton
                      action={borrarZona.bind(null, z.zona)}
                      label={`¿Borrar las ${z.total} direcciones de "${z.zona}"?`}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {filtradas.length > visibles && (
            <div className="px-5 py-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setVisibles((v) => v + POR_PAGINA)}
                className="text-xs text-white/50 hover:text-white transition-colors"
              >
                Ver {Math.min(POR_PAGINA, filtradas.length - visibles)} zonas más ({filtradas.length - visibles} restantes)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
