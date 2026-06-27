'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function addOferta(formData: FormData) {
  const tipo = formData.get('tipo') as 'minorista' | 'mayorista'
  const nombre = (formData.get('nombre') as string).trim()
  const detalle = (formData.get('detalle') as string | null)?.trim() ?? ''
  const precio = (formData.get('precio') as string | null)?.trim() || 'Consultá'

  if (!nombre) return

  const supabase = getSupabaseAdmin()
  const { data: last } = await supabase
    .from('ofertas')
    .select('orden')
    .eq('tipo', tipo)
    .order('orden', { ascending: false })
    .limit(1)

  const orden = last && last.length > 0 ? (last[0].orden ?? 0) + 1 : 0

  await supabase.from('ofertas').insert({ tipo, nombre, detalle, precio, orden })

  revalidatePath('/')
  revalidatePath('/admin/ofertas')
}

export async function deleteOferta(id: string) {
  await getSupabaseAdmin().from('ofertas').delete().eq('id', id)
  revalidatePath('/')
  revalidatePath('/admin/ofertas')
}

export async function toggleOfertaActiva(id: string, activa: boolean) {
  await getSupabaseAdmin().from('ofertas').update({ activa: !activa }).eq('id', id)
  revalidatePath('/')
  revalidatePath('/admin/ofertas')
}
