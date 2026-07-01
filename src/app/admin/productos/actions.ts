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

export type ImportResult = { count: number; error?: never } | { error: string; count?: never }

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
  const productos = rows
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

  if (productos.length === 0) return { error: 'El archivo no tiene datos válidos' }

  const { error } = await getSupabaseAdmin().from('productos').insert(productos)
  if (error) return { error: error.message }

  revalidatePath('/admin/productos')
  revalidatePath('/vendedor/productos')
  return { count: productos.length }
}
