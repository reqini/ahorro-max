'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase'
import { hashPassword } from '@/lib/vendedores'

export async function addVendedor(formData: FormData) {
  const username = (formData.get('username') as string)?.trim().toLowerCase()
  const nombre = (formData.get('nombre') as string)?.trim()
  const password = (formData.get('password') as string)?.trim()

  if (!username || !nombre || !password) return

  await getSupabaseAdmin()
    .from('vendedores')
    .insert({ username, nombre, password_hash: hashPassword(password) })

  revalidatePath('/admin/vendedores')
  redirect('/admin/vendedores')
}

export async function toggleVendedor(id: string, activo: boolean) {
  await getSupabaseAdmin().from('vendedores').update({ activo }).eq('id', id)
  revalidatePath('/admin/vendedores')
}

export async function resetPassword(id: string, formData: FormData) {
  const password = (formData.get('password') as string)?.trim()
  if (!password) return
  await getSupabaseAdmin()
    .from('vendedores')
    .update({ password_hash: hashPassword(password) })
    .eq('id', id)
  revalidatePath('/admin/vendedores')
}

export async function deleteVendedor(id: string) {
  await getSupabaseAdmin().from('vendedores').delete().eq('id', id)
  revalidatePath('/admin/vendedores')
}
