import { getSupabaseAdmin } from './supabase'

/** Precio de referencia de una cadena, cargado a mano y con link a su ecommerce. */
export interface ComparacionPrecio {
  cadena: string
  precio: string
  url: string
  /** Fecha en que se tomó la referencia (YYYY-MM-DD). */
  fecha: string
}

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
  marca: string
  imagen_url: string
  comparaciones: ComparacionPrecio[]
}

/** Precio de referencia de una cadena, cargado a mano y con link a su ecommerce. */
export function parseComparaciones(valor: unknown): ComparacionPrecio[] {
  if (!Array.isArray(valor)) return []
  return valor
    .filter((c): c is Record<string, unknown> => !!c && typeof c === 'object')
    .map((c) => ({
      cadena: String(c.cadena ?? '').trim(),
      precio: String(c.precio ?? '').trim(),
      url: String(c.url ?? '').trim(),
      fecha: String(c.fecha ?? '').trim(),
    }))
    .filter((c) => c.cadena && c.precio)
}

/** Convierte una fila cruda de Supabase en Producto, con los campos nuevos normalizados. */
function normalizarProducto(row: Record<string, unknown>): Producto {
  return {
    ...(row as unknown as Producto),
    marca: String(row.marca ?? ''),
    imagen_url: String(row.imagen_url ?? ''),
    comparaciones: parseComparaciones(row.comparaciones),
  }
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
    return (data ?? []).map(normalizarProducto)
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
      .order("nombre")
    if (error) return []
    return (data ?? []).map(normalizarProducto)
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
