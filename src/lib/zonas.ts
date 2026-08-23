import { getSupabaseAdmin } from './supabase'
import { ZONAS_ENTREGA, ZONAS_DETALLE, MAYORISTA_MIN_MONTO } from '@/constants'

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

export interface ZonaDetalle {
  region: string
  dias: string
  barrios: string[]
}

const ZONAS_DETALLE_SEED = ZONAS_DETALLE as unknown as ZonaDetalle[]

function esZonaDetalleValida(v: unknown): v is ZonaDetalle {
  return (
    !!v &&
    typeof v === 'object' &&
    typeof (v as ZonaDetalle).region === 'string' &&
    typeof (v as ZonaDetalle).dias === 'string' &&
    Array.isArray((v as ZonaDetalle).barrios)
  )
}

/** Zonas de reparto agrupadas por región y día, mostradas en el sitio (home + landings mayoristas). Editable desde /admin/zonas. */
export async function getZonasDetalle(): Promise<ZonaDetalle[]> {
  try {
    const { data } = await getSupabaseAdmin().from('config').select('value').eq('key', 'zonas_detalle').single()
    if (!data?.value) return ZONAS_DETALLE_SEED
    const parsed = JSON.parse(data.value)
    return Array.isArray(parsed) && parsed.length > 0 && parsed.every(esZonaDetalleValida)
      ? parsed
      : ZONAS_DETALLE_SEED
  } catch {
    return ZONAS_DETALLE_SEED
  }
}

export async function saveZonasDetalle(zonas: ZonaDetalle[]): Promise<void> {
  await getSupabaseAdmin()
    .from('config')
    .upsert({ key: 'zonas_detalle', value: JSON.stringify(zonas), updated_at: new Date().toISOString() }, { onConflict: 'key' })
}

/** Mínimo de pedido para acceder a precio mayorista (ej: "$300.000"). Editable desde /admin/zonas. */
export async function getMayoristaMinMonto(): Promise<string> {
  try {
    const { data } = await getSupabaseAdmin().from('config').select('value').eq('key', 'mayorista_min_monto').single()
    return data?.value?.trim() || MAYORISTA_MIN_MONTO
  } catch {
    return MAYORISTA_MIN_MONTO
  }
}

export async function saveMayoristaMinMonto(monto: string): Promise<void> {
  await getSupabaseAdmin()
    .from('config')
    .upsert({ key: 'mayorista_min_monto', value: monto, updated_at: new Date().toISOString() }, { onConflict: 'key' })
}
