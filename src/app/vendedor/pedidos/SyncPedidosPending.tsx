'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { syncPedidoOffline } from './actions'

const STORAGE_KEY = 'vendedor_pending_pedidos'

interface PendingPedido {
  id: string
  cliente_nombre: string
  items: { producto_id: string; nombre: string; categoria: string; precio: string; cantidad: number }[]
  tipo_precio: 'minorista' | 'mayorista'
  total_estimado: string
  notas?: string
}

function readStorage(): PendingPedido[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') } catch { return [] }
}

export function SyncPedidosPending() {
  const [pending, setPending] = useState<PendingPedido[]>([])
  const [syncing, setSyncing] = useState(false)
  const router = useRouter()

  const refresh = useCallback(() => setPending(readStorage()), [])

  useEffect(() => {
    refresh()
    window.addEventListener('pedido-offline-saved', refresh)
    window.addEventListener('online', refresh)
    return () => {
      window.removeEventListener('pedido-offline-saved', refresh)
      window.removeEventListener('online', refresh)
    }
  }, [refresh])

  async function doSync() {
    if (syncing) return
    setSyncing(true)
    const failed: PendingPedido[] = []
    for (const item of readStorage()) {
      try {
        await syncPedidoOffline({
          cliente_nombre: item.cliente_nombre ?? '',
          items: item.items,
          tipo_precio: item.tipo_precio,
          total_estimado: item.total_estimado,
          notas: item.notas,
        })
      } catch { failed.push(item) }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(failed))
    setPending(failed)
    setSyncing(false)
    if (failed.length === 0) router.refresh()
  }

  if (pending.length === 0) return null

  return (
    <div className="bg-amber-950/40 border-b border-amber-700/40 px-4 py-3 flex items-center justify-between gap-3">
      <p className="text-amber-300 text-sm font-medium">
        {pending.length} pedido{pending.length > 1 ? 's' : ''} sin sincronizar
      </p>
      <button onClick={doSync} disabled={syncing}
        className="text-xs px-4 py-1.5 bg-amber-700/60 hover:bg-amber-700 text-amber-100 font-bold uppercase tracking-wide transition-colors disabled:opacity-50 shrink-0">
        {syncing ? 'Sincronizando...' : `Sincronizar (${pending.length})`}
      </button>
    </div>
  )
}
