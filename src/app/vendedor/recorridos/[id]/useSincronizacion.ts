'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { EstadoParada } from '@/lib/recorridos'
import { guardarNotaParada, marcarParada } from '../actions'

export type Operacion =
  | { tipo: 'estado'; paradaId: string; valor: EstadoParada }
  | { tipo: 'nota'; paradaId: string; valor: string }

function clave(recorridoId: string) {
  return `recorrido_pendientes_${recorridoId}`
}

function leerCola(recorridoId: string): Operacion[] {
  try {
    return JSON.parse(localStorage.getItem(clave(recorridoId)) ?? '[]') as Operacion[]
  } catch {
    return []
  }
}

function escribirCola(recorridoId: string, cola: Operacion[]) {
  localStorage.setItem(clave(recorridoId), JSON.stringify(cola))
}

async function enviar(recorridoId: string, op: Operacion) {
  if (op.tipo === 'estado') await marcarParada(recorridoId, op.paradaId, op.valor)
  else await guardarNotaParada(recorridoId, op.paradaId, op.valor)
}

/**
 * El vendedor marca paradas caminando por la calle, donde la señal se corta. Cada
 * cambio se manda al servidor y, si falla, queda encolado en el dispositivo para
 * reintentarlo cuando vuelve la conexión. Así no se pierde una visita ya hecha.
 */
export function useSincronizacion(recorridoId: string) {
  const [pendientes, setPendientes] = useState(0)
  const sincronizando = useRef(false)

  const vaciarCola = useCallback(async () => {
    if (sincronizando.current) return
    sincronizando.current = true

    const cola = leerCola(recorridoId)
    const fallidas: Operacion[] = []
    for (const op of cola) {
      try {
        await enviar(recorridoId, op)
      } catch {
        fallidas.push(op)
      }
    }

    escribirCola(recorridoId, fallidas)
    setPendientes(fallidas.length)
    sincronizando.current = false
  }, [recorridoId])

  const registrar = useCallback(
    async (op: Operacion) => {
      try {
        await enviar(recorridoId, op)
      } catch {
        // Se reemplaza cualquier operación previa sobre la misma parada y tipo:
        // solo interesa el último estado, no el historial de toques.
        const cola = leerCola(recorridoId).filter(
          (o) => !(o.paradaId === op.paradaId && o.tipo === op.tipo)
        )
        cola.push(op)
        escribirCola(recorridoId, cola)
        setPendientes(cola.length)
      }
    },
    [recorridoId]
  )

  useEffect(() => {
    // vaciarCola ya deja `pendientes` en lo que no se pudo enviar, así que sirve
    // también como lectura inicial de la cola guardada en el dispositivo.
    void vaciarCola()

    window.addEventListener('online', vaciarCola)
    return () => window.removeEventListener('online', vaciarCola)
  }, [recorridoId, vaciarCola])

  return { pendientes, registrar, vaciarCola }
}
