'use client'

import { useState } from 'react'
import { NuevoPedidoForm } from './NuevoPedidoForm'
import { SyncPedidosPending } from './SyncPedidosPending'
import type { Pedido } from '@/lib/pedidos'

interface ProductoCatalogo {
  id: string
  nombre: string
  categoria: string
  precio_minorista: string
  precio_mayorista: string
}

interface Props {
  pedidos: Pedido[]
  serverProductos: ProductoCatalogo[]
  estadoLabel: Record<string, string>
  estadoColor: Record<string, string>
}

export function PedidosClientPage({ pedidos, serverProductos, estadoLabel, estadoColor }: Props) {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      {showForm && (
        <NuevoPedidoForm
          serverProductos={serverProductos as ProductoCatalogo[]}
          onClose={() => setShowForm(false)}
        />
      )}

      <SyncPedidosPending />

      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex items-center justify-between border-b border-white/10">
        <div>
          <h1 className="text-white font-black text-xl tracking-tight">Pedidos</h1>
          <p className="text-white/30 text-xs mt-0.5">{pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} registrado{pedidos.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#CC0000] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest px-4 py-2.5 transition-colors"
        >
          + Nuevo
        </button>
      </div>

      {/* Lista */}
      {pedidos.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <p className="text-white/20 text-sm mb-4">Sin pedidos todavía</p>
          <button
            onClick={() => setShowForm(true)}
            className="border border-white/20 text-white/50 hover:text-white text-sm px-6 py-2.5 transition-colors"
          >
            Crear primer pedido
          </button>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {pedidos.map(p => (
            <div key={p.id} className="px-4 py-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white/20 text-xs font-mono">#{p.numero}</span>
                    <p className="text-white font-bold text-sm truncate">
                      {p.cliente_nombre || 'Sin nombre'}
                    </p>
                  </div>
                  <p className="text-white/30 text-xs mt-0.5">
                    {new Date(p.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`text-xs px-2 py-0.5 border rounded-sm font-medium ${estadoColor[p.estado]}`}>
                    {estadoLabel[p.estado]}
                  </span>
                  {p.total_estimado && (
                    <p className="text-white font-black text-base mt-1">{p.total_estimado}</p>
                  )}
                </div>
              </div>

              {/* Items resumidos */}
              <div className="flex flex-wrap gap-1 mt-2">
                {(p.items ?? []).slice(0, 5).map((it, i) => (
                  <span key={i} className="text-xs bg-white/5 text-white/50 px-2 py-0.5 rounded-sm">
                    {it.cantidad}× {it.nombre}
                  </span>
                ))}
                {(p.items ?? []).length > 5 && (
                  <span className="text-xs text-white/30 px-2 py-0.5">
                    +{(p.items ?? []).length - 5} más
                  </span>
                )}
              </div>

              {p.notas && (
                <p className="text-white/30 text-xs mt-2 italic">{p.notas}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
