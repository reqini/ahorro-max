import { getSupabaseAdmin } from './supabase'
import { OFERTAS_CONTENT } from '@/constants'

export type OfertaItem = { nombre: string; detalle: string; precio: string }
export type OfertasData = { minorista: OfertaItem[]; mayorista: OfertaItem[] }

export async function getOfertas(): Promise<OfertasData> {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('ofertas')
      .select('tipo, nombre, detalle, precio')
      .eq('activa', true)
      .order('orden')

    if (error || !data?.length) return fallback()

    return {
      minorista: data
        .filter((o: { tipo: string }) => o.tipo === 'minorista')
        .map(({ nombre, detalle, precio }: { nombre: string; detalle: string; precio: string }) => ({ nombre, detalle, precio })),
      mayorista: data
        .filter((o: { tipo: string }) => o.tipo === 'mayorista')
        .map(({ nombre, detalle, precio }: { nombre: string; detalle: string; precio: string }) => ({ nombre, detalle, precio })),
    }
  } catch {
    return fallback()
  }
}

function fallback(): OfertasData {
  return {
    minorista: OFERTAS_CONTENT.minorista.items.map((i) => ({ ...i })),
    mayorista: OFERTAS_CONTENT.mayorista.items.map((i) => ({ ...i })),
  }
}
