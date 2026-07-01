'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getFaqs, saveFaqs } from '@/lib/faqs'
import type { FaqItem } from '@/lib/faqs'

export async function addFaq(formData: FormData) {
  const q = (formData.get('q') as string | null)?.trim()
  const a = (formData.get('a') as string | null)?.trim()
  if (!q || !a) return

  const faqs = await getFaqs()
  const newFaq: FaqItem = { id: crypto.randomUUID(), q, a }
  await saveFaqs([...faqs, newFaq])

  revalidatePath('/')
  revalidatePath('/admin/faqs')
  redirect('/admin/faqs?added=1')
}

export async function deleteFaq(id: string) {
  const faqs = await getFaqs()
  await saveFaqs(faqs.filter((f) => f.id !== id))
  revalidatePath('/')
  revalidatePath('/admin/faqs')
}

export async function moveFaq(id: string, dir: 'up' | 'down') {
  const faqs = await getFaqs()
  const idx = faqs.findIndex((f) => f.id === id)
  if (idx === -1) return
  const next = dir === 'up' ? idx - 1 : idx + 1
  if (next < 0 || next >= faqs.length) return
  const reordered = [...faqs]
  ;[reordered[idx], reordered[next]] = [reordered[next], reordered[idx]]
  await saveFaqs(reordered)
  revalidatePath('/')
  revalidatePath('/admin/faqs')
}
