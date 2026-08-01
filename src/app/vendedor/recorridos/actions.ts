'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getVendedorUsername } from '@/lib/admin-auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import { crearRecorrido } from '@/lib/recorridos'
import type { EstadoParada } from '@/lib/recorridos'

export type NuevoRecorridoState = { error: string } | null

export async function crearRecorridoAction(
  _prev: NuevoRecorridoState,
  formData: FormData
): Promise<NuevoRecorridoState> {
  const vendedor = await getVendedorUsername()
  if (!vendedor) return { error: 'Sesión vencida. Volvé a entrar.' }

  const zonas = formData.getAll('zonas').map(String).filter(Boolean)
  const nombre = (formData.get('nombre') as string | null)?.trim() ?? ''
  const maxParadas = Math.min(Math.max(Number(formData.get('max_paradas')) || 40, 1), 200)
  const soloGeocodificadas = formData.get('solo_geocodificadas') === 'on'

  const resultado = await crearRecorrido({ vendedor, nombre, zonas, maxParadas, soloGeocodificadas })
  if ('error' in resultado) return { error: resultado.error }

  revalidatePath('/vendedor/recorridos')
  redirect(`/vendedor/recorridos/${resultado.id}`)
}

/** Verifica que el recorrido sea del vendedor logueado antes de tocarlo. */
async function recorridoPropio(recorridoId: string): Promise<string | null> {
  const vendedor = await getVendedorUsername()
  if (!vendedor) return null

  const { data } = await getSupabaseAdmin()
    .from('recorridos')
    .select('id')
    .eq('id', recorridoId)
    .eq('vendedor', vendedor)
    .single()

  return data ? recorridoId : null
}

export async function marcarParada(recorridoId: string, paradaId: string, estado: EstadoParada) {
  if (!(await recorridoPropio(recorridoId))) return

  await getSupabaseAdmin()
    .from('recorrido_paradas')
    .update({
      estado,
      visitada_at: estado === 'pendiente' ? null : new Date().toISOString(),
    })
    .eq('id', paradaId)
    .eq('recorrido_id', recorridoId)

  // A propósito NO se revalida el detalle: la pantalla ya refleja el cambio de
  // forma optimista y volver a renderizarla desde el servidor pisaba el estado
  // local, haciendo que una parada recién marcada apareciera destildada.
  revalidatePath('/vendedor/recorridos')
}

export async function guardarNotaParada(recorridoId: string, paradaId: string, nota: string) {
  if (!(await recorridoPropio(recorridoId))) return

  await getSupabaseAdmin()
    .from('recorrido_paradas')
    .update({ nota: nota.slice(0, 500) })
    .eq('id', paradaId)
    .eq('recorrido_id', recorridoId)
}

export async function cambiarEstadoRecorrido(recorridoId: string, estado: 'activo' | 'completado') {
  if (!(await recorridoPropio(recorridoId))) return

  await getSupabaseAdmin()
    .from('recorridos')
    .update({ estado, updated_at: new Date().toISOString() })
    .eq('id', recorridoId)

  revalidatePath(`/vendedor/recorridos/${recorridoId}`)
  revalidatePath('/vendedor/recorridos')
}

export async function borrarRecorrido(recorridoId: string) {
  if (!(await recorridoPropio(recorridoId))) return

  await getSupabaseAdmin().from('recorridos').delete().eq('id', recorridoId)
  revalidatePath('/vendedor/recorridos')
}
