import { getSupabaseAdmin } from './supabase'
import { ZONAS_ENTREGA } from '@/constants'

export async function getZonasEntrega(): Promise<string[]> {
  try {
    const { data } = await getSupabaseAdmin()
      .from('config')
      .select('value')
      .eq('key', 'zonas_entrega')
      .single()

    if (!data?.value) return ZONAS_ENTREGA.zonas as unknown as string[]
    const parsed = JSON.parse(data.value)
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : (ZONAS_ENTREGA.zonas as unknown as string[])
  } catch {
    return ZONAS_ENTREGA.zonas as unknown as string[]
  }
}
