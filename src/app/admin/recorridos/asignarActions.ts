'use server'

import { revalidatePath } from 'next/cache'
import { isAdmin } from '@/lib/admin-auth'
import { crearRecorrido } from '@/lib/recorridos'
import { getSupabaseAdmin } from '@/lib/supabase'

export type AsignarResult =
  | { ok: string; error?: never }
  | { error: string; ok?: never }

export async function asignarRecorridoAction(
  _prev: AsignarResult | null,
  formData: FormData
): Promise<AsignarResult> {
  if (!(await isAdmin())) return { error: 'No autorizado' }

  const vendedor = (formData.get('vendedor') as string | null)?.trim() ?? ''
  const fecha = (formData.get('fecha') as string | null)?.trim() ?? ''
  const nombre = (formData.get('nombre') as string | null)?.trim() ?? ''
  const zonas = formData.getAll('zonas').map(String).filter(Boolean)
  const maxParadas = Math.min(Math.max(Number(formData.get('max_paradas')) || 40, 1), 200)
  const soloGeocodificadas = formData.get('solo_geocodificadas') === 'on'

  if (!vendedor) return { error: 'Elegí un vendedor' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return { error: 'Elegí un día válido' }
  if (zonas.length === 0) return { error: 'Elegí al menos una zona' }

  const resultado = await crearRecorrido({
    vendedor,
    nombre,
    zonas,
    maxParadas,
    soloGeocodificadas,
    fecha,
    asignadoPor: 'admin',
  })

  if ('error' in resultado) return { error: resultado.error }

  revalidatePath('/admin/recorridos')
  revalidatePath('/vendedor/recorridos')
  return { ok: `Recorrido de ${resultado.paradas} paradas asignado a ${vendedor}` }
}

export async function borrarRecorridoAdmin(id: string) {
  if (!(await isAdmin())) return

  await getSupabaseAdmin().from('recorridos').delete().eq('id', id)
  revalidatePath('/admin/recorridos')
  revalidatePath('/vendedor/recorridos')
}

/** Reasigna un recorrido a otro día sin volver a calcular la ruta. */
export async function moverRecorrido(id: string, fecha: string) {
  if (!(await isAdmin())) return
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return

  await getSupabaseAdmin()
    .from('recorridos')
    .update({ fecha, updated_at: new Date().toISOString() })
    .eq('id', id)

  revalidatePath('/admin/recorridos')
  revalidatePath('/vendedor/recorridos')
}
