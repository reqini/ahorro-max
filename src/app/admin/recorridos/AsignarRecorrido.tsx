'use client'

import { useActionState, useMemo, useState } from 'react'
import type { ZonaResumen } from '@/lib/direcciones'
import { DIAS_LABORALES, etiquetaDia } from '@/lib/recorridos'
import { asignarRecorridoAction } from './asignarActions'

const MAX_LISTA = 40

interface Props {
  zonas: ZonaResumen[]
  vendedores: { username: string; nombre: string }[]
  /** Los cinco días hábiles de la semana que se está viendo. */
  semana: string[]
  hoy: string
}

export function AsignarRecorrido({ zonas, vendedores, semana, hoy }: Props) {
  const [busqueda, setBusqueda] = useState('')
  const [elegidas, setElegidas] = useState<string[]>([])
  const [dia, setDia] = useState(() => semana.find((d) => d >= hoy) ?? semana[0])
  const [state, action, pending] = useActionState(asignarRecorridoAction, null)

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    const base = q
      ? zonas.filter((z) => z.zona.toLowerCase().includes(q) || z.partido.toLowerCase().includes(q))
      : [...zonas].sort((a, b) => b.geocodificadas - a.geocodificadas)
    return base
  }, [zonas, busqueda])

  const seleccion = zonas.filter((z) => elegidas.includes(z.zona))
  const ubicadas = seleccion.reduce((a, z) => a + z.geocodificadas, 0)

  function toggle(zona: string) {
    setElegidas((prev) => (prev.includes(zona) ? prev.filter((z) => z !== zona) : [...prev, zona]))
  }

  if (vendedores.length === 0) {
    return (
      <div className="border border-white/20 bg-[#131313] p-5">
        <p className="text-white/40 text-sm">
          No hay vendedores activos. Creá uno en Vendedores para poder asignarle recorridos.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="border border-white/20 bg-[#131313] shadow-xl shadow-black/60 p-5 space-y-4">
      <div>
        <h2 className="text-white font-semibold text-sm">Asignar recorrido a un vendedor</h2>
        <p className="text-white/35 text-xs mt-1">
          Elegí el vendedor, el día y las zonas. La app arma el orden a pie y le aparece en su agenda.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wide font-bold mb-2">Vendedor</label>
          <select
            name="vendedor"
            required
            className="w-full bg-[#1a1a1a] border border-white/25 text-white text-sm px-3 py-2 focus:outline-none focus:border-[#CC0000]"
          >
            {vendedores.map((v) => (
              <option key={v.username} value={v.username}>
                {v.nombre} (@{v.username})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wide font-bold mb-2">Nombre</label>
          <input
            name="nombre"
            placeholder="Opcional"
            className="w-full bg-[#1a1a1a] border border-white/25 text-white text-sm px-3 py-2 focus:outline-none focus:border-[#CC0000] placeholder-white/35"
          />
        </div>
      </div>

      {/* Día de la semana */}
      <div>
        <label className="block text-white/50 text-xs uppercase tracking-wide font-bold mb-2">Día</label>
        <input type="hidden" name="fecha" value={dia} />
        <div className="grid grid-cols-5 gap-1.5">
          {semana.map((fecha, i) => {
            const activo = fecha === dia
            const esHoy = fecha === hoy
            return (
              <button
                key={fecha}
                type="button"
                onClick={() => setDia(fecha)}
                className={`py-2 px-1 border text-center transition-colors ${
                  activo
                    ? 'bg-[#CC0000] border-[#CC0000] text-white'
                    : 'border-white/15 text-white/50 hover:border-white/35'
                }`}
              >
                <span className="block text-[10px] font-bold uppercase">{DIAS_LABORALES[i].slice(0, 3)}</span>
                <span className="block text-[10px] opacity-70">{etiquetaDia(fecha)}</span>
                {esHoy && <span className="block text-[9px] text-[#F5C000] font-bold">hoy</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Zonas */}
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
                className="text-xs px-2 py-1 bg-[#CC0000]/15 border border-[#CC0000]/50 text-white"
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
          placeholder="Buscar zona o partido..."
          className="w-full bg-[#1a1a1a] border border-white/25 text-white text-sm px-3 py-2 mb-2 focus:outline-none focus:border-[#CC0000] placeholder-white/35"
        />

        <div className="max-h-48 overflow-y-auto border border-white/10 divide-y divide-white/5">
          {filtradas.slice(0, MAX_LISTA).map((z) => {
            const activa = elegidas.includes(z.zona)
            return (
              <button
                key={z.zona}
                type="button"
                onClick={() => toggle(z.zona)}
                className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors ${
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
                    {z.total} direcciones · {z.geocodificadas} ubicadas
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 items-end">
        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wide font-bold mb-2">Paradas</label>
          <select
            name="max_paradas"
            defaultValue="40"
            className="w-full bg-[#1a1a1a] border border-white/25 text-white text-sm px-3 py-2 focus:outline-none focus:border-[#CC0000]"
          >
            {[20, 30, 40, 60, 80, 120].map((n) => (
              <option key={n} value={n}>{n} paradas</option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer pb-2">
          <input type="checkbox" name="solo_geocodificadas" defaultChecked className="accent-[#CC0000]" />
          <span className="text-white/50 text-xs">Solo direcciones ubicadas</span>
        </label>
      </div>

      {seleccion.length > 0 && (
        <p className="text-white/40 text-xs">
          {seleccion.reduce((a, z) => a + z.total, 0)} direcciones ·{' '}
          <span className={ubicadas === 0 ? 'text-amber-400' : 'text-green-400'}>{ubicadas} ubicadas</span>
        </p>
      )}

      {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
      {state?.ok && <p className="text-green-400 text-sm">✓ {state.ok}</p>}

      <button
        type="submit"
        disabled={pending || elegidas.length === 0}
        className="w-full px-5 py-2.5 bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40"
      >
        {pending ? 'Armando recorrido...' : 'Asignar recorrido'}
      </button>
    </form>
  )
}
