import { getPedidos } from '@/lib/pedidos'
import { getVendedorUsername } from '@/lib/admin-auth'
import { getProductos } from '@/lib/productos'
import { getSiteConfig } from '@/lib/config'
import { PedidosClientPage } from './PedidosClientPage'

export const dynamic = 'force-dynamic'

export default async function VendedorPedidosPage() {
  const [username, productos, config] = await Promise.all([
    getVendedorUsername(),
    getProductos(),
    getSiteConfig(),
  ])

  const pedidos = username ? await getPedidos({ vendedor: username }) : []
  const empresa = {
    razon_social: config.empresa_razon_social ?? '',
    cuit: config.empresa_cuit ?? '',
    domicilio: config.empresa_domicilio ?? '',
  }

  return (
    <div className="flex flex-col">
      <PedidosClientPage pedidos={pedidos} serverProductos={productos} empresa={empresa} />
    </div>
  )
}
