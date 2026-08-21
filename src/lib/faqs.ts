import { getSupabaseAdmin } from './supabase'
import { MAYORISTA_MIN_MONTO } from '@/constants'

export interface FaqItem {
  id: string
  q: string
  a: string
}

export const FAQS_DEFAULT: FaqItem[] = [
  { id: '1', q: '¿Dónde están ubicados?', a: 'En Ciudadela, Partido de Tres de Febrero, zona oeste del Gran Buenos Aires.' },
  { id: '2', q: '¿Venden al por mayor y al por menor?', a: `Sí. Atendemos a consumidores finales sin mínimo de compra y a revendedores, almacenes y kioscos con precios por volumen a partir de ${MAYORISTA_MIN_MONTO} por pedido.` },
  { id: '3', q: '¿Cuál es el WhatsApp?', a: '+54 11 5020-3114. Podés escribirnos para consultar precios, catálogo y disponibilidad de stock.' },
  { id: '4', q: '¿Qué productos tienen?', a: 'Bebidas, bebidas con alcohol, almacén y productos de kiosco.' },
  { id: '5', q: '¿Cuáles son los horarios?', a: 'Lunes a Viernes de 8:00 a 18:00 hs. Sábados de 8:00 a 13:00 hs. Domingos cerrado.' },
  { id: '6', q: '¿Tienen lista de precios mayoristas?', a: 'Sí, tenemos catálogo descargable en esta página. También podés pedirla por WhatsApp.' },
  { id: '7', q: '¿Hay mínimo de compra?', a: `Para compras minoristas no hay mínimo. Para precio mayorista, el mínimo es de ${MAYORISTA_MIN_MONTO} por pedido.` },
  { id: '8', q: '¿A qué zonas hacen envío?', a: 'Zona Oeste (Ciudadela, Ramos Mejía, Lomas del Mirador, San Justo, Villa Luzuriaga, Morón, Villa Sarmiento, Haedo) los miércoles y sábados. Zona CABA (Villa Devoto, Agronomía, Villa del Parque, Villa Real, Monte Castro, Villa Santa Rita, Versalles, Liniers, Villa Luro, Floresta) los martes y viernes.' },
  { id: '9', q: '¿Cómo pido precio mayorista?', a: 'Completá el formulario en la sección mayorista de esta página o escribinos directamente por WhatsApp.' },
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
