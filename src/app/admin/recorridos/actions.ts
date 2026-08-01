'use server'

import { revalidatePath } from 'next/cache'
import * as XLSX from 'xlsx'
import { getSupabaseAdmin } from '@/lib/supabase'
import { mensajeDeError, parseHoja, type DireccionNueva } from '@/lib/direcciones'

export type ImportDireccionesResult =
  | { total: number; nuevas: number; repetidas: number; hojas: string[]; zonas: number; error?: never }
  | { error: string; total?: never; nuevas?: never; repetidas?: never; hojas?: never; zonas?: never }

const TANDA_INSERT = 500

export async function importDireccionesAction(
  _prev: ImportDireccionesResult | null,
  formData: FormData
): Promise<ImportDireccionesResult> {
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { error: 'Seleccioná un archivo Excel o CSV' }

  let wb: XLSX.WorkBook
  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    wb = XLSX.read(buffer, { type: 'buffer' })
  } catch {
    return { error: 'No se pudo leer el archivo. Usá formato .xlsx o .csv' }
  }

  // El padrón viene repartido en varias hojas (CABA en una, GBA en otra) y con
  // encabezados distintos, así que se recorren todas y se toman las que tengan
  // columnas reconocibles.
  const hojasUsadas: string[] = []
  const direcciones: DireccionNueva[] = []

  for (const nombreHoja of wb.SheetNames) {
    const filas = XLSX.utils.sheet_to_json(wb.Sheets[nombreHoja], { header: 1, defval: '' }) as unknown[][]
    const parseadas = parseHoja(filas)
    if (parseadas.length === 0) continue
    hojasUsadas.push(nombreHoja)
    direcciones.push(...parseadas)
  }

  if (direcciones.length === 0) {
    return { error: 'Ninguna hoja tiene las columnas esperadas (Domicilio/Dirección + Localidad, Barrio o Partido)' }
  }

  // Dedupe dentro del propio archivo antes de tocar la base: el upsert falla si un
  // mismo lote trae dos filas con la misma clave.
  const porClave = new Map<string, DireccionNueva>()
  for (const d of direcciones) porClave.set(d.clave, d)
  const unicas = [...porClave.values()]

  const supabase = getSupabaseAdmin()
  let nuevas = 0

  for (let i = 0; i < unicas.length; i += TANDA_INSERT) {
    const tanda = unicas.slice(i, i + TANDA_INSERT)
    // ignoreDuplicates deja intactas las direcciones ya cargadas, así reimportar el
    // padrón no borra las coordenadas que costaron una hora de geocodificación.
    const { data, error } = await supabase
      .from('direcciones')
      .upsert(tanda, { onConflict: 'clave', ignoreDuplicates: true })
      .select('id')

    if (error) return { error: mensajeDeError(error.message) }
    nuevas += data?.length ?? 0
  }

  revalidatePath('/admin/recorridos')
  revalidatePath('/vendedor/recorridos')

  return {
    total: unicas.length,
    nuevas,
    repetidas: unicas.length - nuevas,
    hojas: hojasUsadas,
    zonas: new Set(unicas.map((d) => d.zona)).size,
  }
}

export async function borrarZona(zona: string) {
  await getSupabaseAdmin().from('direcciones').delete().eq('zona', zona)
  revalidatePath('/admin/recorridos')
  revalidatePath('/vendedor/recorridos')
}

export async function reintentarFallidas(zona: string) {
  await getSupabaseAdmin()
    .from('direcciones')
    .update({ geo_estado: 'pendiente' })
    .eq('zona', zona)
    .eq('geo_estado', 'fallo')
  revalidatePath('/admin/recorridos')
}
