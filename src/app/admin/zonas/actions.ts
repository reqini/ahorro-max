'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getZonasEntrega } from '@/lib/zonas'

export async function addZona(formData: FormData) {
  const nombre = (formData.get('nombre') as string | null)?.trim()
  if (!nombre) return

  const zonas = await getZonasEntrega()
  if (zonas.includes(nombre)) return

  const nuevas = [...zonas, nombre]
  await getSupabaseAdmin()
    .from('config')
    .upsert({ key: 'zonas_entrega', value: JSON.stringify(nuevas), updated_at: new Date().toISOString() }, { onConflict: 'key' })

  revalidatePath('/')
  redirect('/admin/zonas?added=1')
}

export async function deleteZona(nombre: string) {
  const zonas = await getZonasEntrega()
  const nuevas = zonas.filter((z) => z !== nombre)

  await getSupabaseAdmin()
    .from('config')
    .upsert({ key: 'zonas_entrega', value: JSON.stringify(nuevas), updated_at: new Date().toISOString() }, { onConflict: 'key' })

  revalidatePath('/')
  revalidatePath('/admin/zonas')
}
