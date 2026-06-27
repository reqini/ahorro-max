'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function saveConfig(formData: FormData) {
  const telefono = (formData.get('telefono') as string | null)?.trim() ?? ''
  const whatsapp_number = (formData.get('whatsapp_number') as string | null)?.trim() ?? ''
  const whatsapp_msg_minorista = (formData.get('whatsapp_msg_minorista') as string | null)?.trim() ?? ''
  const whatsapp_msg_mayorista = (formData.get('whatsapp_msg_mayorista') as string | null)?.trim() ?? ''

  const supabase = getSupabaseAdmin()
  const now = new Date().toISOString()

  const updates = [
    { key: 'telefono', value: telefono, updated_at: now },
    { key: 'whatsapp_number', value: whatsapp_number, updated_at: now },
    { key: 'whatsapp_msg_minorista', value: whatsapp_msg_minorista, updated_at: now },
    { key: 'whatsapp_msg_mayorista', value: whatsapp_msg_mayorista, updated_at: now },
  ]

  for (const row of updates) {
    await supabase.from('config').upsert(row, { onConflict: 'key' })
  }

  revalidatePath('/')
  redirect('/admin/config?saved=1')
}
