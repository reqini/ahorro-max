import { getSupabaseAdmin } from './supabase'

export interface FaqItem {
  id: string
  q: string
  a: string
}

export const FAQS_DEFAULT: FaqItem[] = [
  { id: '1', q: '¿Dónde están ubicados?', a: 'En Ciudadela, Partido de Tres de Febrero, zona oeste del Gran Buenos Aires.' },
  { id: '2', q: '¿Venden al por mayor y al por menor?', a: 'Sí. Atendemos a consumidores finales sin mínimo de compra y a revendedores, almacenes y kioscos con precios por volumen.' },
  { id: '3', q: '¿Cuál es el WhatsApp?', a: '+54 11 5020-3114. Podés escribirnos para consultar precios, catálogo y disponibilidad de stock.' },
  { id: '4', q: '¿Qué productos tienen?', a: 'Productos de consumo masivo: alimentos secos, bebidas, limpieza, higiene personal y del hogar.' },
  { id: '5', q: '¿Cuáles son los horarios?', a: 'Lunes a Viernes de 8:00 a 18:00 hs. Sábados de 8:00 a 13:00 hs. Domingos cerrado.' },
  { id: '6', q: '¿Tienen lista de precios mayoristas?', a: 'Sí, tenemos catálogo descargable en esta página. También podés pedirla por WhatsApp.' },
]

export async function getFaqs(): Promise<FaqItem[]> {
  try {
    const { data } = await getSupabaseAdmin()
      .from('config')
      .select('value')
      .eq('key', 'faqs')
      .single()

    if (!data?.value) return FAQS_DEFAULT
    const parsed = JSON.parse(data.value)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : FAQS_DEFAULT
  } catch {
    return FAQS_DEFAULT
  }
}

export async function saveFaqs(faqs: FaqItem[]): Promise<void> {
  await getSupabaseAdmin()
    .from('config')
    .upsert({ key: 'faqs', value: JSON.stringify(faqs), updated_at: new Date().toISOString() }, { onConflict: 'key' })
}
