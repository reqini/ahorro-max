'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase'
import type { PromoFlash } from '@/lib/promo'

export async function savePromo(formData: FormData) {
  const promo: PromoFlash = {
    activa: formData.get('activa') === '1',
    badge: (formData.get('badge') as string | null)?.trim() ?? '',
    titulo: (formData.get('titulo') as string | null)?.trim() ?? '',
    subtitulo: (formData.get('subtitulo') as string | null)?.trim() ?? '',
    imagen_url: (formData.get('imagen_url') as string | null)?.trim() ?? '',
    precio: (formData.get('precio') as string | null)?.trim() ?? '',
    precio_anterior: (formData.get('precio_anterior') as string | null)?.trim() ?? '',
    cta_texto: (formData.get('cta_texto') as string | null)?.trim() ?? '',
    cta_mensaje_wa: (formData.get('cta_mensaje_wa') as string | null)?.trim() ?? '',
    countdown_segundos: parseInt((formData.get('countdown_segundos') as string) ?? '0', 10) || 0,
  }

  await getSupabaseAdmin()
    .from('config')
    .upsert(
      { key: 'promo_flash', value: JSON.stringify(promo), updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    )

  revalidatePath('/')
  redirect('/admin/promo?saved=1')
}
