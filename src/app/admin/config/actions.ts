'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function saveConfig(formData: FormData) {
  const telefono = (formData.get('telefono') as string).trim()
  const whatsapp_number = (formData.get('whatsapp_number') as string).trim()
  const whatsapp_msg_minorista = (formData.get('whatsapp_msg_minorista') as string).trim()
  const whatsapp_msg_mayorista = (formData.get('whatsapp_msg_mayorista') as string).trim()

  const supabase = getSupabaseAdmin()

  const updates = [
    { key: 'telefono', value: telefono, updated_at: new Date().toISOString() },
    { key: 'whatsapp_number', value: whatsapp_number, updated_at: new Date().toISOString() },
    { key: 'whatsapp_msg_minorista', value: whatsapp_msg_minorista, updated_at: new Date().toISOString() },
    { key: 'whatsapp_msg_mayorista', value: whatsapp_msg_mayorista, updated_at: new Date().toISOString() },
  ]

  for (const row of updates) {
    await supabase.from('config').upsert(row, { onConflict: 'key' })
  }

  revalidatePath('/')
  revalidatePath('/admin/config')
}
