'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { syncClienteOffline } from './syncAction'

interface PendingCliente {
  id: string
  nombre: string
  tipo: string
  tipo_negocio: string
  contacto: string
  telefono: string
  direccion: string
  horarios: string
  dia_visita: string
  metodo_contacto: string
  zona_ruta: string
  nota?: string
}

const STORAGE_KEY = 'vendedor_pending_clientes'

export function SyncPending() {
  const [pending, setPending] = useState<PendingCliente[]>([])
  const [syncing, setSyncing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setPending(JSON.parse(raw))
    } catch { /* noop */ }
  }, [])

  if (pending.length === 0) return null

  async function handleSync() {
    setSyncing(true)
    const failed: PendingCliente[] = []
    for (const item of pending) {
      try {
        await syncClienteOffline({
          nombre: item.nombre ?? '',
          tipo: item.tipo ?? 'potencial',
          tipo_negocio: item.tipo_negocio ?? '',
          contacto: item.contacto ?? '',
          telefono: item.telefono ?? '',
          direccion: item.direccion ?? '',
          horarios: item.horarios ?? '',
          dia_visita: item.dia_visita ?? '',
          metodo_contacto: item.metodo_contacto ?? '',
          zona_ruta: item.zona_ruta ?? '',
          nota: item.nota,
        })
      } catch {
        failed.push(item)
      }
    }
    if (failed.length === 0) {
      localStorage.removeItem(STORAGE_KEY)
      setPending([])
      router.refresh()
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(failed))
      setPending(failed)
    }
    setSyncing(false)
  }

  return (
    <div className="bg-amber-950/40 border-b border-amber-700/40 px-4 py-3 flex items-center justify-between gap-3">
      <p className="text-amber-300 text-sm font-medium">
        {pending.length} cliente{pending.length > 1 ? 's' : ''} guardado{pending.length > 1 ? 's' : ''} offline
      </p>
      <button
        onClick={handleSync}
        disabled={syncing}
        className="text-xs px-4 py-1.5 bg-amber-700/60 hover:bg-amber-700 text-amber-100 font-bold uppercase tracking-wide transition-colors disabled:opacity-50 shrink-0"
      >
        {syncing ? 'Sincronizando...' : `Sincronizar (${pending.length})`}
      </button>
    </div>
  )
}
