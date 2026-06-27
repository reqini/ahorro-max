'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function addSucursal(formData: FormData) {
  const nombre = (formData.get('nombre') as string).trim()
  const direccion = (formData.get('direccion') as string).trim()
  const telefono = (formData.get('telefono') as string | null)?.trim() ?? ''
  const horarios = (formData.get('horarios') as string | null)?.trim() ?? ''
  const maps_url = (formData.get('maps_url') as string | null)?.trim() ?? ''

  if (!nombre || !direccion) return

  const supabase = getSupabaseAdmin()
  const { data: last } = await supabase
    .from('sucursales')
    .select('orden')
    .order('orden', { ascending: false })
    .limit(1)

  const orden = last && last.length > 0 ? (last[0].orden ?? 0) + 1 : 0

  await supabase.from('sucursales').insert({ nombre, direccion, telefono, horarios, maps_url, orden })
  revalidatePath('/')
  revalidatePath('/admin/sucursales')
}

export async function deleteSucursal(id: string) {
  await getSupabaseAdmin().from('sucursales').delete().eq('id', id)
  revalidatePath('/')
  revalidatePath('/admin/sucursales')
}

export async function updateSucursal(formData: FormData) {
  const id = formData.get('id') as string
  const nombre = (formData.get('nombre') as string).trim()
  const direccion = (formData.get('direccion') as string).trim()
  const telefono = (formData.get('telefono') as string | null)?.trim() ?? ''
  const horarios = (formData.get('horarios') as string | null)?.trim() ?? ''
  const maps_url = (formData.get('maps_url') as string | null)?.trim() ?? ''

  if (!id || !nombre || !direccion) return

  await getSupabaseAdmin()
    .from('sucursales')
    .update({ nombre, direccion, telefono, horarios, maps_url })
    .eq('id', id)

  revalidatePath('/')
  revalidatePath('/admin/sucursales')
}

export async function toggleSucursalActiva(id: string, activa: boolean) {
  await getSupabaseAdmin().from('sucursales').update({ activa: !activa }).eq('id', id)
  revalidatePath('/')
  revalidatePath('/admin/sucursales')
}
