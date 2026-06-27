import { getSupabaseAdmin } from './supabase'

export async function getSiteConfig(): Promise<Record<string, string>> {
  try {
    const { data } = await getSupabaseAdmin()
      .from('config')
      .select('key, value')
    return Object.fromEntries((data ?? []).map((r: { key: string; value: string }) => [r.key, r.value]))
  } catch {
    return {}
  }
}
