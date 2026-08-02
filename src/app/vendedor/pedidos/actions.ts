'use server'

import { revalidatePath } from 'next/cache'
import { getVendedorUsername } from '@/lib/admin-auth'
import { createPedido, updateEstadoPedido, updatePedido, deletePedido, getPedidos, guardarFirmaPedido, marcarComprobanteEnviado, marcarEntregado, marcarPagado, guardarFechaEntrega, type PedidoItem } from '@/lib/pedidos'

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

export async function crearPedidoAction(formData: FormData): Promise<{ id: string | null; numero?: number; error?: string }> {
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

  const creado = await createPedido({ vendedor, cliente_nombre, items, tipo_precio, total_estimado, notas })
  if (!creado) return { id: null, error: 'Error al guardar' }

  revalidatePath('/vendedor/pedidos')
  revalidatePath('/admin/pedidos')
  return { id: creado.id, numero: creado.numero }
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
  const creado = await createPedido({ vendedor, ...data })
  if (creado) {
    revalidatePath('/vendedor/pedidos')
    revalidatePath('/admin/pedidos')
  }
  return creado?.id ?? null
}

export async function cambiarEstadoPedido(id: string, estado: 'pendiente' | 'confirmado' | 'entregado' | 'cancelado') {
  await updateEstadoPedido(id, estado)
  revalidatePath('/vendedor/pedidos')
  revalidatePath('/admin/pedidos')
}

/** Verifica que el pedido sea del vendedor logueado antes de tocarlo. */
async function esPedidoPropio(pedidoId: string): Promise<boolean> {
  const vendedor = await getVendedorUsername()
  if (!vendedor) return false
  const pedidos = await getPedidos({ vendedor })
  return pedidos.some(p => p.id === pedidoId)
}

/**
 * Guarda la firma del cliente como constancia del pedido y del precio acordado.
 * Llega como data URL PNG desde el canvas del celular.
 */
export async function guardarFirmaAction(
  pedidoId: string,
  firma: string,
  aclaracion: string
): Promise<{ error?: string }> {
  if (!(await esPedidoPropio(pedidoId))) return { error: 'Sin permiso' }
  if (!firma.startsWith('data:image/png;base64,')) return { error: 'Firma inválida' }
  // Una firma normal pesa unos pocos KB; el tope evita guardar cualquier cosa.
  if (firma.length > 400_000) return { error: 'La firma es demasiado grande' }

  const ok = await guardarFirmaPedido(pedidoId, firma, aclaracion.trim().slice(0, 120))
  if (!ok) return { error: 'No se pudo guardar la firma' }

  revalidatePath('/vendedor/pedidos')
  revalidatePath('/admin/pedidos')
  return {}
}

/** Deja registrado que se le mandó el comprobante al cliente por WhatsApp. */
export async function marcarEnviadoAction(pedidoId: string, telefono: string): Promise<void> {
  if (!(await esPedidoPropio(pedidoId))) return

  await marcarComprobanteEnviado(pedidoId, telefono.trim().slice(0, 40))
  revalidatePath('/vendedor/pedidos')
  revalidatePath('/admin/pedidos')
}

/** Registra la entrega del pedido; si `pagado`, deja el pago asentado en el mismo acto. */
export async function marcarEntregadoAction(
  pedidoId: string,
  pagado: boolean
): Promise<{ error?: string }> {
  if (!(await esPedidoPropio(pedidoId))) return { error: 'Sin permiso' }

  const ok = await marcarEntregado(pedidoId, pagado)
  if (!ok) return { error: 'No se pudo registrar la entrega' }

  revalidatePath('/vendedor/pedidos')
  revalidatePath('/admin/pedidos')
  return {}
}

/** Registra el pago de un pedido que se había entregado a cuenta. */
export async function marcarPagadoAction(pedidoId: string): Promise<{ error?: string }> {
  if (!(await esPedidoPropio(pedidoId))) return { error: 'Sin permiso' }

  const ok = await marcarPagado(pedidoId)
  if (!ok) return { error: 'No se pudo registrar el pago' }

  revalidatePath('/vendedor/pedidos')
  revalidatePath('/admin/pedidos')
  return {}
}

/** Guarda o cambia el día pactado de entrega. */
export async function guardarFechaEntregaAction(
  pedidoId: string,
  fecha: string
): Promise<{ error?: string }> {
  if (!(await esPedidoPropio(pedidoId))) return { error: 'Sin permiso' }
  if (fecha && !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return { error: 'Fecha inválida' }

  const ok = await guardarFechaEntrega(pedidoId, fecha)
  if (!ok) return { error: 'No se pudo guardar la fecha' }

  revalidatePath('/vendedor/pedidos')
  revalidatePath('/admin/pedidos')
  return {}
}
