'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface Ubicacion {
  lat: number
  lng: number
  /** Radio de error en metros que informa el GPS. */
  precision: number
}

export type EstadoUbicacion =
  | 'inactiva'
  | 'buscando'
  | 'activa'
  | 'denegada'
  | 'no_disponible'
  | 'error'

export const MENSAJE_UBICACION: Record<EstadoUbicacion, string> = {
  inactiva: '',
  buscando: 'Buscando tu ubicación...',
  activa: '',
  denegada: 'Bloqueaste el acceso a la ubicación. Habilitalo en los permisos del navegador para ver dónde estás.',
  no_disponible: 'Este dispositivo no tiene GPS disponible.',
  error: 'No se pudo obtener la ubicación. Probá de nuevo con el GPS encendido.',
}

/**
 * Sigue la posición del vendedor mientras camina el recorrido. Usa watchPosition
 * (no una consulta puntual) para que el mapa se actualice solo a medida que avanza.
 */
export function useUbicacion() {
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null)
  const [estado, setEstado] = useState<EstadoUbicacion>('inactiva')
  const watchId = useRef<number | null>(null)

  const detener = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current)
      watchId.current = null
    }
    setUbicacion(null)
    setEstado('inactiva')
  }, [])

  const iniciar = useCallback(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setEstado('no_disponible')
      return
    }
    if (watchId.current !== null) return

    setEstado('buscando')
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUbicacion({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          precision: pos.coords.accuracy,
        })
        setEstado('activa')
      },
      (err) => {
        setEstado(err.code === err.PERMISSION_DENIED ? 'denegada' : 'error')
        if (watchId.current !== null) {
          navigator.geolocation.clearWatch(watchId.current)
          watchId.current = null
        }
      },
      // El vendedor camina: conviene precisión alta y tolerar posiciones de unos segundos.
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    )
  }, [])

  // Cortar el GPS al salir de la pantalla: si no, sigue consumiendo batería.
  useEffect(() => {
    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current)
    }
  }, [])

  return { ubicacion, estado, iniciar, detener }
}
