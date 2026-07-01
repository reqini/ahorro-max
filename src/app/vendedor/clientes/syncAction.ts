'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getVendedorUsername } from '@/lib/admin-auth'
import type { TipoCliente } from '@/lib/clientes'

interface PendingData {
  nombre: string
  tipo: string
  tipo_negocio: string
  contacto: string
  telefono: string
  direccion: string
  horarios: string
  dia_visita: string
  metodo_contacto: string
  zona_ruta: string
  nota?: string
}

export async function syncClienteOffline(data: PendingData): Promise<string | null> {
  if (!data.nombre?.trim()) return null

  const vendedor = (await getVendedorUsername()) ?? ''
  const supabase = getSupabaseAdmin()

  const { data: row } = await supabase
    .from('clientes')
    .insert({
      nombre: data.nombre.trim(),
      tipo: (data.tipo as TipoCliente) ?? 'potencial',
      tipo_negocio: data.tipo_negocio ?? '',
      contacto: data.contacto ?? '',
      telefono: data.telefono ?? '',
      direccion: data.direccion ?? '',
      horarios: data.horarios ?? '',
      dia_visita: data.dia_visita ?? '',
      metodo_contacto: data.metodo_contacto ?? '',
      zona_ruta: data.zona_ruta ?? '',
      vendedor,
      estado: 'activo',
    })
    .select('id')
    .single()

  if (row?.id && data.nota?.trim()) {
    await supabase.from('notas_cliente').insert({ cliente_id: row.id, texto: data.nota.trim() })
  }

  revalidatePath('/vendedor/clientes')
  revalidatePath('/admin/clientes')
  return row?.id ?? null
}
