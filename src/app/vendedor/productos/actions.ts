'use server'

import { getVendedorUsername } from '@/lib/admin-auth'
import { createPedido, type PedidoItem } from '@/lib/pedidos'
import { revalidatePath } from 'next/cache'

export async function crearPedidoDesdeVendedor(data: {
  cliente_nombre: string
  cliente_id?: string
  items: { producto_id: string; nombre: string; categoria: string; precio: string; cantidad: number }[]
  tipo_precio: 'minorista' | 'mayorista'
  total_estimado: string
  notas: string
}): Promise<{ id?: string | null; error?: string }> {
  const vendedor = await getVendedorUsername()
  if (!vendedor) return { error: 'Sin sesión' }

  if (!data.items || data.items.length === 0) return { error: 'Agregá al menos un producto' }

  const items: PedidoItem[] = data.items.map(it => ({
    producto_id: it.producto_id,
    nombre: it.nombre,
    categoria: it.categoria,
    precio: it.precio,
    cantidad: it.cantidad,
  }))

  const id = await createPedido({
    vendedor,
    cliente_nombre: data.cliente_nombre || 'Sin nombre',
    cliente_id: data.cliente_id,
    items,
    tipo_precio: data.tipo_precio,
    total_estimado: data.total_estimado,
    notas: data.notas || undefined,
  })

  if (!id) return { error: 'Error al guardar el pedido' }

  revalidatePath('/vendedor/pedidos')
  revalidatePath('/admin/pedidos')
  return { id }
}
