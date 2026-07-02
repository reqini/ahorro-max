import { getSupabaseAdmin } from './supabase'

export interface PedidoItem {
  producto_id: string
  nombre: string
  categoria: string
  precio: string
  cantidad: number
}

export interface Pedido {
  id: string
  numero: number
  vendedor: string
  cliente_nombre: string
  cliente_id: string | null
  items: PedidoItem[]
  tipo_precio: 'minorista' | 'mayorista'
  total_estimado: string
  estado: 'pendiente' | 'confirmado' | 'entregado' | 'cancelado'
  notas: string
  created_at: string
}

export async function getPedidos(filtro?: { vendedor?: string; estado?: string }): Promise<Pedido[]> {
  try {
    let query = getSupabaseAdmin()
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (filtro?.vendedor) query = query.eq('vendedor', filtro.vendedor)
    if (filtro?.estado) query = query.eq('estado', filtro.estado)

    const { data, error } = await query
    if (error) return []
    return (data ?? []) as Pedido[]
  } catch { return [] }
}

export async function createPedido(pedido: {
  vendedor: string
  cliente_nombre: string
  cliente_id?: string
  items: PedidoItem[]
  tipo_precio: 'minorista' | 'mayorista'
  total_estimado: string
  notas?: string
}): Promise<string | null> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('pedidos')
      .insert(pedido)
      .select('id')
      .single()
    if (error) return null
    return data.id
  } catch { return null }
}

export async function updateEstadoPedido(id: string, estado: Pedido['estado']): Promise<boolean> {
  try {
    const { error } = await getSupabaseAdmin()
      .from('pedidos')
      .update({ estado })
      .eq('id', id)
    return !error
  } catch { return false }
}

export async function updatePedido(id: string, data: {
  cliente_nombre?: string
  cliente_id?: string | null
  items?: PedidoItem[]
  tipo_precio?: 'minorista' | 'mayorista'
  total_estimado?: string
  notas?: string
}): Promise<boolean> {
  try {
    const { error } = await getSupabaseAdmin()
      .from('pedidos')
      .update(data)
      .eq('id', id)
    return !error
  } catch { return false }
}

export async function deletePedido(id: string): Promise<boolean> {
  try {
    const { error } = await getSupabaseAdmin()
      .from('pedidos')
      .delete()
      .eq('id', id)
    return !error
  } catch { return false }
}
