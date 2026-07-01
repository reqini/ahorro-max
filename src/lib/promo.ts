import { getSupabaseAdmin } from './supabase'

export interface PromoFlash {
  activa: boolean
  tipo: 'minorista' | 'mayorista' | 'ambos'
  badge: string
  titulo: string
  subtitulo: string
  imagen_url: string
  precio_minorista: string
  precio_mayorista: string
  precio_anterior: string
  cta_texto: string
  cta_mensaje_wa: string
  countdown_segundos: number
}

export const PROMO_DEFAULT: PromoFlash = {
  activa: false,
  tipo: 'ambos',
  badge: '⚡ OFERTA RELÁMPAGO ⚡',
  titulo: 'Oferta Especial',
  subtitulo: '¡Solo por tiempo limitado!',
  imagen_url: '',
  precio_minorista: '',
  precio_mayorista: '',
  precio_anterior: '',
  cta_texto: '¡Quiero esta oferta!',
  cta_mensaje_wa: 'Hola! Vi la oferta relámpago en su web y quiero aprovecharla 🔥',
  countdown_segundos: 0,
}

export async function getPromoFlash(): Promise<PromoFlash> {
  try {
    const { data } = await getSupabaseAdmin()
      .from('config')
      .select('value')
      .eq('key', 'promo_flash')
      .single()

    if (!data?.value) return PROMO_DEFAULT
    return { ...PROMO_DEFAULT, ...JSON.parse(data.value) }
  } catch {
    return PROMO_DEFAULT
  }
}
