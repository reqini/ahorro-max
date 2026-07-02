'use server'

import { revalidatePath } from 'next/cache'
import { getVendedorUsername } from '@/lib/admin-auth'
import { createPedido, updateEstadoPedido, updatePedido, deletePedido, getPedidos, type PedidoItem } from '@/lib/pedidos'

const EDIT_WINDOW_MS = 30 * 60 * 1000 // 30 minutos

async function assertEditWindow(pedidoId: string): Promise<string | null> {
  const vendedor = await getVendedorUsername()
  if (!vendedor) return 'Sin sesión'
  const pedidos = await getPedidos({ vendedor })
  const pedido = pedidos.find(p => p.id === pedidoId)
  if (!pedido) return 'Pedido no encontrado'
  if (pedido.vendedor !== vendedor) return 'Sin permiso'
  const age = Date.now() - new Date(pedido.created_at).getTime()
  if (age > EDIT_WINDOW_MS) return 'El tiempo de edición expiró (30 min)'
  return null
}

export async function editarPedidoAction(pedidoId: string, data: {
  cliente_nombre: string
  items: PedidoItem[]
  tipo_precio: 'minorista' | 'mayorista'
  total_estimado: string
  notas: string
}): Promise<{ error?: string }> {
  const err = await assertEditWindow(pedidoId)
  if (err) return { error: err }
  const ok = await updatePedido(pedidoId, data)
  if (!ok) return { error: 'Error al guardar' }
  revalidatePath('/vendedor/pedidos')
  revalidatePath('/admin/pedidos')
  return {}
}

export async function eliminarPedidoAction(pedidoId: string): Promise<{ error?: string }> {
  const err = await assertEditWindow(pedidoId)
  if (err) return { error: err }
  const ok = await deletePedido(pedidoId)
  if (!ok) return { error: 'Error al eliminar' }
  revalidatePath('/vendedor/pedidos')
  revalidatePath('/admin/pedidos')
  return {}
}

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
