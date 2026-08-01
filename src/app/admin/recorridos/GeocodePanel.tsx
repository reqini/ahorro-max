'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface RespuestaTanda {
  procesadas: number
  ok: number
  fallidas: number
  restantes: number
  error?: string
}

interface Props {
  pendientes: number
  /** Zona a procesar; vacío = todo el padrón. */
  zona?: string
  compacto?: boolean
}

const POR_TANDA = 20
const SEGUNDOS_POR_DIRECCION = 1.15

function estimar(pendientes: number): string {
  const seg = Math.round(pendientes * SEGUNDOS_POR_DIRECCION)
  if (seg < 90) return `~${seg} seg`
  const min = Math.round(seg / 60)
  if (min < 60) return `~${min} min`
  return `~${(min / 60).toFixed(1).replace('.', ',')} h`
}

export function GeocodePanel({ pendientes, zona, compacto = false }: Props) {
  const router = useRouter()
  const [corriendo, setCorriendo] = useState(false)
  const [restantes, setRestantes] = useState(pendientes)
  const [ok, setOk] = useState(0)
  const [fallidas, setFallidas] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const cancelado = useRef(false)

  const total = pendientes || 1
  const procesadas = ok + fallidas

  async function correr() {
    cancelado.current = false
    setCorriendo(true)
    setError(null)
    setOk(0)
    setFallidas(0)

    let quedan = pendientes
    while (quedan > 0 && !cancelado.current) {
      let data: RespuestaTanda
      try {
        const res = await fetch('/api/admin/geocode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ zonas: zona ? [zona] : [], limite: POR_TANDA }),
        })
        data = await res.json()
        if (!res.ok) throw new Error(data?.error ?? `Error ${res.status}`)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error de red')
        break
      }

      setOk((v) => v + data.ok)
      setFallidas((v) => v + data.fallidas)
      setRestantes(data.restantes)
      quedan = data.restantes

      if (data.error) {
        setError(`${data.error}. Se pausó acá; podés reintentar en un rato.`)
        break
      }
      // Sin avance no tiene sentido seguir llamando: evita un loop infinito.
      if (data.procesadas === 0) break
    }

    setCorriendo(false)
    router.refresh()
  }

  function cancelar() {
    cancelado.current = true
  }

  if (pendientes === 0 && !corriendo && procesadas === 0) {
    return compacto ? null : (
      <p className="text-white/35 text-sm">Todas las direcciones del padrón ya fueron procesadas.</p>
    )
  }

  const boton = (
    <button
      type="button"
      onClick={corriendo ? cancelar : correr}
      className={`text-xs px-3 py-1.5 border transition-colors shrink-0 ${
        corriendo
          ? 'border-white/30 text-white/60 hover:text-white'
          : 'border-[#F5C000]/50 text-[#F5C000] hover:bg-[#F5C000]/10'
      }`}
    >
      {corriendo ? 'Detener' : compacto ? '📍 Geocodificar' : `📍 Geocodificar ${pendientes} direcciones`}
    </button>
  )

  if (compacto && !corriendo && procesadas === 0) return boton

  return (
    <div className={compacto ? 'w-full' : 'border border-white/20 bg-[#131313] shadow-xl shadow-black/60 p-5'}>
      {!compacto && (
        <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
          <div>
            <h2 className="text-white font-semibold text-sm">Geocodificar direcciones</h2>
            <p className="text-white/35 text-xs mt-1 max-w-md">
              Busca la ubicación de cada dirección en OpenStreetMap para poder ordenar los recorridos a pie.
              Es gratis pero permite una consulta por segundo: {pendientes} pendientes ≈ {estimar(pendientes)}.
              Podés dejar esta pestaña abierta y volver después.
            </p>
          </div>
          {boton}
        </div>
      )}

      {compacto && <div className="flex items-center gap-3 mb-2">{boton}</div>}

      {(corriendo || procesadas > 0) && (
        <div className="space-y-2">
          <div className="h-1.5 bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#F5C000] transition-all duration-300"
              style={{ width: `${Math.min(100, (procesadas / total) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-white/45">
            {procesadas} de {pendientes} · <span className="text-green-400">{ok} ubicadas</span>
            {fallidas > 0 && <> · <span className="text-amber-400/80">{fallidas} sin resultado</span></>}
            {corriendo && restantes > 0 && <> · quedan {estimar(restantes)}</>}
          </p>
        </div>
      )}

      {error && <p className="mt-2 text-red-400 text-xs">{error}</p>}
    </div>
  )
}
