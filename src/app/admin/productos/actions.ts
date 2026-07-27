'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase'
import * as XLSX from 'xlsx'

function str(fd: FormData, key: string) {
  return (fd.get(key) as string | null)?.trim() ?? ''
}

export async function addProducto(formData: FormData) {
  const nombre = str(formData, 'nombre')
  if (!nombre) return

  await getSupabaseAdmin().from('productos').insert({
    nombre,
    precio_minorista: str(formData, 'precio_minorista'),
    precio_mayorista: str(formData, 'precio_mayorista'),
    categoria:        str(formData, 'categoria'),
    descripcion:      str(formData, 'descripcion'),
    activo: true,
  })

  revalidatePath('/admin/productos')
  revalidatePath('/vendedor/productos')
  redirect('/admin/productos')
}

export async function deleteProducto(id: string) {
  await getSupabaseAdmin().from('productos').delete().eq('id', id)
  revalidatePath('/admin/productos')
  revalidatePath('/vendedor/productos')
}

export async function toggleProducto(id: string, activo: boolean) {
  await getSupabaseAdmin().from('productos').update({ activo }).eq('id', id)
  revalidatePath('/admin/productos')
  revalidatePath('/vendedor/productos')
}

export type ImportResult =
  | { count: number; nuevos: number; actualizados: number; ignoradas: number; error?: never }
  | { error: string; count?: never; nuevos?: never; actualizados?: never; ignoradas?: never }

// Una fila real de producto tiene al menos un precio con dígitos. Descarta filas
// basura tipo encabezados repetidos dentro del archivo ("Precio x Pack", "Precio Unitario"),
// comunes en listas de precios armadas a mano con secciones por categoría.
function looksLikeGarbagePrice(s: string): boolean {
  return s.length > 0 && !/\d/.test(s)
}

export async function importProductosAction(
  _prev: ImportResult | null,
  formData: FormData
): Promise<ImportResult> {
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { error: 'Seleccioná un archivo Excel o CSV' }

  let rows: unknown[][]
  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const wb = XLSX.read(buffer, { type: 'buffer' })
    const ws = wb.Sheets[wb.SheetNames[0]]
    rows = XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][]
  } catch {
    return { error: 'No se pudo leer el archivo. Usá formato .xlsx o .csv' }
  }

  // Skip header row, filter empty rows
  const parseadas = rows
    .slice(1)
    .filter((r) => r[0])
    .map((r) => ({
      nombre:           String(r[0] ?? '').trim(),
      precio_minorista: String(r[1] ?? '').trim(),
      precio_mayorista: String(r[2] ?? '').trim(),
      categoria:        String(r[3] ?? '').trim(),
      descripcion:      String(r[4] ?? '').trim(),
      activo: true,
    }))
    .filter((p) => p.nombre)

  const productos = parseadas.filter(
    (p) => !looksLikeGarbagePrice(p.precio_minorista) && !looksLikeGarbagePrice(p.precio_mayorista)
  )
  const ignoradas = parseadas.length - productos.length

  if (productos.length === 0) return { error: 'El archivo no tiene datos válidos' }

  const supabase = getSupabaseAdmin()

  // Reimportar la misma lista no debe duplicar productos: los que ya existen
  // (mismo nombre, sin distinguir mayúsculas) se actualizan en vez de insertarse de nuevo.
  const { data: existentes, error: fetchError } = await supabase.from('productos').select('id, nombre')
  if (fetchError) return { error: fetchError.message }

  const idPorNombre = new Map((existentes ?? []).map((p) => [p.nombre.trim().toLowerCase(), p.id as string]))

  const nuevos = productos.filter((p) => !idPorNombre.has(p.nombre.toLowerCase()))
  const actualizaciones = productos
    .filter((p) => idPorNombre.has(p.nombre.toLowerCase()))
    .map((p) => ({ id: idPorNombre.get(p.nombre.toLowerCase())!, data: p }))

  if (nuevos.length > 0) {
    const { error } = await supabase.from('productos').insert(nuevos)
    if (error) return { error: error.message }
  }

  if (actualizaciones.length > 0) {
    const results = await Promise.all(
      actualizaciones.map(({ id, data }) => supabase.from('productos').update(data).eq('id', id))
    )
    const failed = results.find((r) => r.error)
    if (failed?.error) return { error: failed.error.message }
  }

  revalidatePath('/admin/productos')
  revalidatePath('/vendedor/productos')
  return { count: productos.length, nuevos: nuevos.length, actualizados: actualizaciones.length, ignoradas }
}
