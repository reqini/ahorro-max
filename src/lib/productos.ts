import { getSupabaseAdmin } from './supabase'

export interface Producto {
  id: string
  nombre: string
  precio_minorista: string
  precio_mayorista: string
  categoria: string
  descripcion: string
  activo: boolean
  orden: number
  created_at: string
}

export async function getProductos(filtro?: { categoria?: string; busqueda?: string }): Promise<Producto[]> {
  try {
    let query = getSupabaseAdmin()
      .from('productos')
      .select('*')
      .eq('activo', true)
      .order('categoria')
      .order('nombre')

    if (filtro?.categoria) query = query.eq('categoria', filtro.categoria)
    if (filtro?.busqueda) query = query.ilike('nombre', `%${filtro.busqueda}%`)

    const { data, error } = await query
    if (error) return []
    return (data ?? []) as Producto[]
  } catch {
    return []
  }
}

export async function getAllProductos(): Promise<Producto[]> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('productos')
      .select('*')
      .order('categoria')
      .order('nombre')
    if (error) return []
    return (data ?? []) as Producto[]
  } catch {
    return []
  }
}

export async function getCategorias(): Promise<string[]> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('productos')
      .select('categoria')
      .eq('activo', true)
    if (error) return []
    const cats = [...new Set((data ?? []).map((r: { categoria: string }) => r.categoria).filter(Boolean))]
    return cats.sort()
  } catch {
    return []
  }
}
