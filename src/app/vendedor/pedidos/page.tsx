import { getPedidos } from '@/lib/pedidos'
import { getVendedorUsername } from '@/lib/admin-auth'
import { getProductos } from '@/lib/productos'
import { PedidosClientPage } from './PedidosClientPage'

export const dynamic = 'force-dynamic'

const ESTADO_LABEL: Record<string, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}
const ESTADO_COLOR: Record<string, string> = {
  pendiente: 'text-amber-400 bg-amber-950/40 border-amber-700/40',
  confirmado: 'text-blue-400 bg-blue-950/40 border-blue-700/40',
  entregado: 'text-green-400 bg-green-950/40 border-green-700/40',
  cancelado: 'text-white/30 bg-white/5 border-white/10',
}

export default async function VendedorPedidosPage() {
  const [username, productos] = await Promise.all([
    getVendedorUsername(),
    getProductos(),
  ])

  const pedidos = username ? await getPedidos({ vendedor: username }) : []

  return (
    <div className="flex flex-col">
      <PedidosClientPage pedidos={pedidos} serverProductos={productos} estadoLabel={ESTADO_LABEL} estadoColor={ESTADO_COLOR} />
    </div>
  )
}
