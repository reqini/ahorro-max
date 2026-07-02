'use server'

import { revalidatePath } from 'next/cache'
import { getVendedorUsername } from '@/lib/admin-auth'
import { createPedido, updateEstadoPedido, type PedidoItem } from '@/lib/pedidos'

export async function crearPedidoAction(formData: FormData): Promise<{ id: string | null; error?: string }> {
  const vendedor = await getVendedorUsername()
  if (!vendedor) return { id: null, error: 'Sin sesión' }

  const cliente_nombre = (formData.get('cliente_nombre') as string)?.trim() ?? ''
  const tipo_precio = (formData.get('tipo_precio') as 'minorista' | 'mayorista') ?? 'minorista'
  const notas = (formData.get('notas') as string)?.trim()
  const total_estimado = (formData.get('total_estimado') as string) ?? '0'
  const itemsRaw = formData.get('items') as string

  let items: PedidoItem[] = []
  try { items = JSON.parse(itemsRaw) } catch { return { id: null, error: 'Items inválidos' } }

  if (items.length === 0) return { id: null, error: 'Agregá al menos un producto' }

  const id = await createPedido({ vendedor, cliente_nombre, items, tipo_precio, total_estimado, notas })
  if (!id) return { id: null, error: 'Error al guardar' }

  revalidatePath('/vendedor/pedidos')
  revalidatePath('/admin/pedidos')
  return { id }
}

export async function syncPedidoOffline(data: {
  cliente_nombre: string
  items: PedidoItem[]
  tipo_precio: 'minorista' | 'mayorista'
  total_estimado: string
  notas?: string
}): Promise<string | null> {
  const vendedor = await getVendedorUsername()
  if (!vendedor) return null
  const id = await createPedido({ vendedor, ...data })
  if (id) {
    revalidatePath('/vendedor/pedidos')
    revalidatePath('/admin/pedidos')
  }
  return id
}

export async function cambiarEstadoPedido(id: string, estado: 'pendiente' | 'confirmado' | 'entregado' | 'cancelado') {
  await updateEstadoPedido(id, estado)
  revalidatePath('/vendedor/pedidos')
  revalidatePath('/admin/pedidos')
}
