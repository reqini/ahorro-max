'use client'

import { SyncPedidosPending } from './SyncPedidosPending'
import { PedidoCard } from './PedidoCard'
import { OfflineBar } from '@/components/ui/OfflineBar'
import { agruparPedidosPorFecha, resumenDelMes } from './groupPedidos'
import type { Pedido } from '@/lib/pedidos'
import type { DatosEmpresa } from '@/lib/comprobante'

function formatARS(n: number): string {
  return '$' + Math.round(n).toLocaleString('es-AR')
}

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
  empresa: DatosEmpresa
}

export function PedidosClientPage({ pedidos, serverProductos, empresa }: Props) {
  const grupos = agruparPedidosPorFecha(pedidos)
  const resumen = resumenDelMes(pedidos)

  return (
    <>
      <OfflineBar offlineMessage="los cambios se guardan localmente" />
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

      {/* Resumen del mes */}
      {resumen.cantidad > 0 && (
        <div className="mx-4 mt-4 border border-white/10 bg-[#111] px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-wide">Resumen de {resumen.mesLabel}</p>
            <p className="text-white text-sm font-bold mt-0.5">
              {resumen.cantidad} pedido{resumen.cantidad !== 1 ? 's' : ''}
            </p>
          </div>
          <p className="text-white font-black text-lg">{formatARS(resumen.total)}</p>
        </div>
      )}

      {/* Lista agrupada por fecha */}
      {pedidos.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <p className="text-white/20 text-sm mb-4">Sin pedidos todavía</p>
          <a href="/vendedor/productos"
            className="border border-white/20 text-white/50 hover:text-white text-sm px-6 py-2.5 transition-colors">
            Crear primer pedido
          </a>
        </div>
      ) : (
        <div className="mt-2">
          {grupos.map(grupo => (
            <div key={grupo.label}>
              <p className="px-4 pt-4 pb-1.5 text-white/30 text-[10px] font-bold uppercase tracking-widest sticky top-0 bg-[#0a0a0a] z-10">
                {grupo.label} · {grupo.pedidos.length}
              </p>
              {grupo.pedidos.map(p => (
                <PedidoCard key={p.id} pedido={p} serverProductos={serverProductos} empresa={empresa} />
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
