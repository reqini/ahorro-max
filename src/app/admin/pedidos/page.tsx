import { getPedidos } from '@/lib/pedidos'
import { updateEstadoPedido } from '@/lib/pedidos'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

const ESTADO_LABEL: Record<string, string> = { pendiente: 'Pendiente', confirmado: 'Confirmado', entregado: 'Entregado', cancelado: 'Cancelado' }
const ESTADO_COLOR: Record<string, string> = {
  pendiente: 'bg-amber-950/40 text-amber-400 border-amber-700/40',
  confirmado: 'bg-blue-950/40 text-blue-400 border-blue-700/40',
  entregado: 'bg-green-950/40 text-green-400 border-green-700/40',
  cancelado: 'bg-white/5 text-white/30 border-white/10',
}

async function cambiarEstado(id: string, estado: 'pendiente' | 'confirmado' | 'entregado' | 'cancelado') {
  'use server'
  await updateEstadoPedido(id, estado)
  revalidatePath('/admin/pedidos')
}

export default async function AdminPedidosPage() {
  const pedidos = await getPedidos()

  const pendientes = pedidos.filter(p => p.estado === 'pendiente').length
  const hoy = pedidos.filter(p => new Date(p.created_at).toDateString() === new Date().toDateString()).length

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">Pedidos</h1>
        <p className="text-white/40 text-sm mt-1">
          {pedidos.length} total · {pendientes} pendiente{pendientes !== 1 ? 's' : ''} · {hoy} hoy
        </p>
      </div>

      {pedidos.length === 0 ? (
        <div className="border border-white/10 p-8 text-center">
          <p className="text-white/30 text-sm">Sin pedidos registrados todavía.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidos.map(p => (
            <div key={p.id} className="border border-white/10 bg-[#111] p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white/30 text-xs font-mono">#{p.numero}</span>
                    <span className="text-white font-bold">{p.cliente_nombre || 'Sin nombre'}</span>
                    <span className="text-white/30 text-xs">· @{p.vendedor}</span>
                  </div>
                  <p className="text-white/40 text-xs">
                    {new Date(p.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    {p.tipo_precio && <span className="ml-2 capitalize">{p.tipo_precio}</span>}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  {p.total_estimado && <p className="text-white font-black text-lg">{p.total_estimado}</p>}
                  <span className={`text-xs px-2 py-0.5 border ${ESTADO_COLOR[p.estado]}`}>
                    {ESTADO_LABEL[p.estado]}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="border border-white/5 bg-black/20 divide-y divide-white/5 mb-3">
                {(p.items ?? []).map((it, i) => (
                  <div key={i} className="flex justify-between px-3 py-1.5 text-sm">
                    <span className="text-white/70">{it.cantidad}× {it.nombre}</span>
                    <span className="text-white/40 text-xs">
                      {it.precio && `${it.precio} c/u`}
                    </span>
                  </div>
                ))}
              </div>

              {p.notas && <p className="text-white/40 text-xs italic mb-3">{p.notas}</p>}

              {/* Cambiar estado */}
              <div className="flex gap-2 flex-wrap">
                {(['pendiente', 'confirmado', 'entregado', 'cancelado'] as const).map(estado => (
                  <form key={estado} action={cambiarEstado.bind(null, p.id, estado)}>
                    <button type="submit"
                      disabled={p.estado === estado}
                      className={`text-xs px-3 py-1 border transition-colors disabled:opacity-30 ${p.estado === estado ? ESTADO_COLOR[estado] : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'}`}>
                      {ESTADO_LABEL[estado]}
                    </button>
                  </form>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
