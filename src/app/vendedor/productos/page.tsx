import { getProductos, getCategorias } from '@/lib/productos'
import { getVendedorUsername } from '@/lib/admin-auth'
import { getClientes } from '@/lib/clientes'
import { CatalogoCards } from '@/components/catalogo/CatalogoCards'
import { crearPedidoDesdeVendedor } from './actions'

export const dynamic = 'force-dynamic'

export default async function VendedorProductosPage() {
  const [productos, categorias, username] = await Promise.all([
    getProductos(),
    getCategorias(),
    getVendedorUsername(),
  ])

  const clientes = username ? await getClientes({ vendedor: username }) : []

  return (
    <div className="max-w-2xl mx-auto">
      <CatalogoCards
        productos={productos}
        categorias={categorias}
        modo="vendedor"
        clientes={clientes.map(c => ({ id: c.id, nombre: c.nombre, telefono: c.telefono, tipo_negocio: c.tipo_negocio }))}
        onCrearPedido={crearPedidoDesdeVendedor}
      />
    </div>
  )
}
