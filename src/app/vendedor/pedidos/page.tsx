import { getPedidos } from '@/lib/pedidos'
import { getVendedorUsername } from '@/lib/admin-auth'
import { getProductos } from '@/lib/productos'
import { PedidosClientPage } from './PedidosClientPage'

export const dynamic = 'force-dynamic'

export default async function VendedorPedidosPage() {
  const [username, productos] = await Promise.all([
    getVendedorUsername(),
    getProductos(),
  ])

  const pedidos = username ? await getPedidos({ vendedor: username }) : []

  return (
    <div className="flex flex-col">
      <PedidosClientPage pedidos={pedidos} serverProductos={productos} />
    </div>
  )
}
