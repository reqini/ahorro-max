'use client'

import { useMemo, useState } from 'react'
import { type EstadoParada, type Parada } from '@/lib/recorridos'
import { haversine } from '@/lib/ruta'
import { MapaRecorrido, type PuntoMapa } from './MapaRecorrido'
import { HojaParadas } from './HojaParadas'
import { MENSAJE_UBICACION, useUbicacion } from './useUbicacion'
import { useSincronizacion } from './useSincronizacion'

interface Props {
  recorridoId: string
  paradas: Parada[]
  pie: React.ReactNode
}

export function RecorridoView({ recorridoId, paradas: iniciales, pie }: Props) {
  const [paradas, setParadas] = useState(iniciales)
  const [seguir, setSeguir] = useState(true)
  const [enfoque, setEnfoque] = useState<{ lat: number; lng: number; token: number } | null>(null)
  const { ubicacion, estado, iniciar, detener } = useUbicacion()
  const { pendientes, registrar } = useSincronizacion(recorridoId)

  const puntos = useMemo<PuntoMapa[]>(
    () =>
      paradas
        .filter((p): p is Parada & { lat: number; lng: number } => p.lat != null && p.lng != null)
        .map((p) => ({ orden: p.orden, lat: p.lat, lng: p.lng, direccion: p.direccion, estado: p.estado })),
    [paradas]
  )

  const proxima = useMemo(() => paradas.find((p) => p.estado === 'pendiente') ?? null, [paradas])

  const metrosAProxima = useMemo(() => {
    if (!ubicacion || !proxima?.lat || !proxima?.lng) return null
    return Math.round(haversine(ubicacion, { lat: proxima.lat, lng: proxima.lng }))
  }, [ubicacion, proxima])

  /**
   * `alternar` distingue los dos accesos: en la lista tocar el estado activo lo
   * deshace (sirve para corregirse), pero el botón grande de "Visité" siempre
   * confirma la visita — si también alternara, tocarlo dos veces destildaría la
   * parada que el vendedor acaba de hacer.
   */
  function marcar(parada: Parada, estadoNuevo: EstadoParada, alternar = true) {
    const valor = alternar && parada.estado === estadoNuevo ? 'pendiente' : estadoNuevo
    if (valor === parada.estado) return

    // El vendedor marca caminando: la lista responde al toque y el guardado va detrás.
    setParadas((prev) => prev.map((p) => (p.id === parada.id ? { ...p, estado: valor } : p)))
    void registrar({ tipo: 'estado', paradaId: parada.id, valor })
  }

  function anotar(parada: Parada, nota: string) {
    setParadas((prev) => prev.map((p) => (p.id === parada.id ? { ...p, nota } : p)))
    void registrar({ tipo: 'nota', paradaId: parada.id, valor: nota })
  }

  function irA(parada: Parada) {
    if (parada.lat == null || parada.lng == null) return
    setSeguir(false)
    setEnfoque({ lat: parada.lat, lng: parada.lng, token: Date.now() })
  }

  function alternarGps() {
    if (estado === 'activa' || estado === 'buscando') {
      detener()
      setSeguir(false)
    } else {
      iniciar()
      setSeguir(true)
    }
  }

  const gpsEncendido = estado === 'activa' || estado === 'buscando'
  const aviso = MENSAJE_UBICACION[estado]

  return (
    <>
      <MapaRecorrido
        puntos={puntos}
        ubicacion={ubicacion}
        proximaOrden={proxima?.orden ?? null}
        seguir={seguir}
        enfoque={enfoque}
        onArrastrar={() => setSeguir(false)}
      />

      {puntos.length === 0 && (
        <div className="absolute inset-x-4 top-4 bg-[#0d0d0d]/95 border border-white/15 px-4 py-3">
          <p className="text-white/50 text-xs">
            Ninguna parada de este recorrido tiene ubicación en el mapa. Usá la lista de abajo, que está
            ordenada por calle y altura.
          </p>
        </div>
      )}

      {aviso && (
        <div className="absolute inset-x-4 top-4 bg-[#0d0d0d]/95 border border-white/15 px-4 py-2.5">
          <p className="text-white/60 text-xs">{aviso}</p>
        </div>
      )}

      {/* Controles flotantes */}
      <div className="absolute right-3 top-16 z-[1000] flex flex-col gap-2">
        <button
          type="button"
          onClick={alternarGps}
          className={`w-11 h-11 border flex items-center justify-center text-lg transition-colors ${
            gpsEncendido
              ? 'bg-blue-600 border-blue-400 text-white'
              : 'bg-[#0d0d0d]/90 border-white/20 text-white/60'
          }`}
          aria-label={gpsEncendido ? 'Apagar seguimiento' : 'Ver dónde estoy'}
        >
          ◎
        </button>
        {ubicacion && (
          <button
            type="button"
            onClick={() => setSeguir((v) => !v)}
            className={`w-11 h-11 border flex items-center justify-center text-lg transition-colors ${
              seguir
                ? 'bg-[#CC0000] border-[#CC0000] text-white'
                : 'bg-[#0d0d0d]/90 border-white/20 text-white/60'
            }`}
            aria-label={seguir ? 'Dejar de centrar' : 'Centrar en mí'}
          >
            ⌖
          </button>
        )}
      </div>

      <HojaParadas
        paradas={paradas}
        proxima={proxima}
        metrosAProxima={metrosAProxima}
        sinSincronizar={pendientes}
        onMarcar={marcar}
        onConfirmarVisita={(parada) => marcar(parada, 'visitada', false)}
        onNota={anotar}
        onIrA={irA}
        pie={pie}
      />
    </>
  )
}
