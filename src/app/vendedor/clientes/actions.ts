'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getVendedorUsername } from '@/lib/admin-auth'
import type { TipoCliente } from '@/lib/clientes'

function str(fd: FormData, key: string) {
  return (fd.get(key) as string | null)?.trim() ?? ''
}

export async function addCliente(formData: FormData) {
  const nombre = str(formData, 'nombre')
  if (!nombre) return

  const vendedor = (await getVendedorUsername()) ?? str(formData, 'vendedor')
  const notaInicial = str(formData, 'nota')

  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('clientes')
    .insert({
      nombre,
      tipo:           (formData.get('tipo') as TipoCliente | null) ?? 'potencial',
      telefono:       str(formData, 'telefono'),
      direccion:      str(formData, 'direccion'),
      tipo_negocio:   str(formData, 'tipo_negocio'),
      contacto:       str(formData, 'contacto'),
      horarios:       str(formData, 'horarios'),
      dia_visita:     str(formData, 'dia_visita'),
      metodo_contacto: str(formData, 'metodo_contacto'),
      zona_ruta:      str(formData, 'zona_ruta'),
      vendedor,
      estado:         'activo',
    })
    .select('id')
    .single()

  if (data?.id && notaInicial) {
    await supabase.from('notas_cliente').insert({ cliente_id: data.id, texto: notaInicial })
  }

  revalidatePath('/vendedor/clientes')
  revalidatePath('/admin/clientes')
  redirect(`/vendedor/clientes/${data?.id ?? ''}`)
}

export async function deleteCliente(id: string) {
  await getSupabaseAdmin().from('clientes').delete().eq('id', id)
  revalidatePath('/vendedor/clientes')
  redirect('/vendedor/clientes')
}
