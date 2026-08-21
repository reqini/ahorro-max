import { getSupabaseAdmin } from './supabase'
import { LISTA_MINORISTA, type ArticuloLista } from '@/constants/catalogo'

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
  /** Cómo viene el artículo: "Pack x24 · 473ml · lata". */
  presentacion: string
  /** Precio del pack cerrado completo, para mostrarlo junto al unitario. */
  precio_pack: string
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
    presentacion: String(row.presentacion ?? ''),
    precio_pack: String(row.precio_pack ?? ''),
    comparaciones: parseComparaciones(row.comparaciones),
  }
}

/**
 * Un artículo de la lista visto como producto del catálogo. El precio que ve el
 * consumidor final es el de la unidad suelta; el "mayorista" es lo que sale cada
 * unidad llevando el pack cerrado, que es la ventaja real de comprar el pack.
 */
export function articuloAProducto(a: ArticuloLista, i: number): Producto {
  return {
    id: `lista-${a.slug}`,
    nombre: a.nombre,
    precio_minorista: a.precioUnitario,
    precio_mayorista: a.precioUnitarioPack,
    categoria: a.categoria,
    descripcion: '',
    activo: true,
    orden: i,
    created_at: '',
    marca: a.marca,
    imagen_url: '',
    presentacion: a.presentacion,
    precio_pack: a.precioPack,
    comparaciones: [],
  }
}

/**
 * La lista de precios en código, como productos. Es el respaldo para que la
 * tienda nunca quede vacía: si Supabase no responde —o todavía no se importó la
 * lista— el cliente igual ve los artículos y los precios vigentes.
 */
export function productosDeLaLista(): Producto[] {
  return LISTA_MINORISTA.map(articuloAProducto)
}

function aplicarFiltro(productos: Producto[], filtro?: { categoria?: string; busqueda?: string }): Producto[] {
  const q = filtro?.busqueda?.trim().toLowerCase()
  return productos.filter((p) => {
    if (filtro?.categoria && p.categoria !== filtro.categoria) return false
    if (q && !p.nombre.toLowerCase().includes(q)) return false
    return true
  })
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
    // Sin base, o con la base todavía vacía, la tienda igual tiene que vender:
    // se muestra la lista en código. Un catálogo vacío no es un estado válido.
    if (error) return aplicarFiltro(productosDeLaLista(), filtro)
    if (!data || data.length === 0) return aplicarFiltro(productosDeLaLista(), filtro)
    return data.map(normalizarProducto)
  } catch {
    return aplicarFiltro(productosDeLaLista(), filtro)
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
    if (error) return categoriasDeLaLista()
    const cats = [...new Set((data ?? []).map((r: { categoria: string }) => r.categoria).filter(Boolean))]
    return cats.length > 0 ? cats.sort() : categoriasDeLaLista()
  } catch {
    return categoriasDeLaLista()
  }
}

function categoriasDeLaLista(): string[] {
  return [...new Set(LISTA_MINORISTA.map((a) => a.categoria))].sort()
}
