'use client'

import { useState, useEffect, useCallback } from 'react'
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

function readStorage(): PendingCliente[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function SyncPending() {
  const [pending, setPending] = useState<PendingCliente[]>([])
  const [syncing, setSyncing] = useState(false)
  const router = useRouter()

  const refresh = useCallback(() => setPending(readStorage()), [])

  useEffect(() => {
    refresh()
    // New offline client added in same tab
    window.addEventListener('offline-queue-updated', refresh)
    // Auto-sync when connection is restored
    window.addEventListener('online', refresh)
    return () => {
      window.removeEventListener('offline-queue-updated', refresh)
      window.removeEventListener('online', refresh)
    }
  }, [refresh])

  // Auto-sync when pending items exist and connection is restored
  useEffect(() => {
    if (pending.length === 0 || syncing) return
    if (!navigator.onLine) return
    // Only auto-sync if we just came back online (not on initial mount)
    const handleOnline = () => { if (pending.length > 0) doSync() }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending])

  async function doSync() {
    if (syncing) return
    setSyncing(true)
    const failed: PendingCliente[] = []
    for (const item of readStorage()) {
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

  if (pending.length === 0) return null

  return (
    <div className="bg-amber-950/40 border-b border-amber-700/40 px-4 py-3 flex items-center justify-between gap-3">
      <p className="text-amber-300 text-sm font-medium">
        {pending.length} cliente{pending.length > 1 ? 's' : ''} guardado{pending.length > 1 ? 's' : ''} sin conexión
      </p>
      <button
        onClick={doSync}
        disabled={syncing}
        className="text-xs px-4 py-1.5 bg-amber-700/60 hover:bg-amber-700 text-amber-100 font-bold uppercase tracking-wide transition-colors disabled:opacity-50 shrink-0"
      >
        {syncing ? 'Sincronizando...' : `Sincronizar (${pending.length})`}
      </button>
    </div>
  )
}
