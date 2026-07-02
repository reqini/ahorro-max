'use client'

import { useState } from 'react'
import { SyncPedidosPending } from './SyncPedidosPending'
import { PedidoCard } from './PedidoCard'
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
}

export function PedidosClientPage({ pedidos, serverProductos }: Props) {
  return (
    <>
      <SyncPedidosPending />

      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex items-center justify-between border-b border-white/10">
        <div>
          <h1 className="text-white font-black text-xl tracking-tight">Pedidos</h1>
          <p className="text-white/30 text-xs mt-0.5">
            {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} registrado{pedidos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <a href="/vendedor/productos"
          className="bg-[#CC0000] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest px-4 py-2.5 transition-colors">
          + Nuevo
        </a>
      </div>

      {/* Lista */}
      {pedidos.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <p className="text-white/20 text-sm mb-4">Sin pedidos todavía</p>
          <a href="/vendedor/productos"
            className="border border-white/20 text-white/50 hover:text-white text-sm px-6 py-2.5 transition-colors">
            Crear primer pedido
          </a>
        </div>
      ) : (
        <div>
          {pedidos.map(p => (
            <PedidoCard key={p.id} pedido={p} serverProductos={serverProductos} />
          ))}
        </div>
      )}
    </>
  )
}
