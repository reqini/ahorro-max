'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabase'
import type { TipoCliente, EstadoCliente } from '@/lib/clientes'

function str(fd: FormData, key: string) {
  return (fd.get(key) as string | null)?.trim() ?? ''
}

export async function updateCliente(id: string, formData: FormData) {
  const nombre = str(formData, 'nombre')
  if (!nombre) return

  await getSupabaseAdmin()
    .from('clientes')
    .update({
      nombre,
      telefono:       str(formData, 'telefono'),
      direccion:      str(formData, 'direccion'),
      tipo:           (formData.get('tipo') as TipoCliente | null) ?? 'potencial',
      estado:         (formData.get('estado') as EstadoCliente | null) ?? 'activo',
      tipo_negocio:   str(formData, 'tipo_negocio'),
      contacto:       str(formData, 'contacto'),
      horarios:       str(formData, 'horarios'),
      dia_visita:     str(formData, 'dia_visita'),
      metodo_contacto: str(formData, 'metodo_contacto'),
      vendedor:       str(formData, 'vendedor'),
      zona_ruta:      str(formData, 'zona_ruta'),
      updated_at:     new Date().toISOString(),
    })
    .eq('id', id)

  revalidatePath(`/vendedor/clientes/${id}`)
  revalidatePath('/vendedor/clientes')
  revalidatePath('/admin/clientes')
}

export async function addNota(clienteId: string, formData: FormData) {
  const texto = str(formData, 'texto')
  if (!texto) return

  await getSupabaseAdmin()
    .from('notas_cliente')
    .insert({ cliente_id: clienteId, texto })

  await getSupabaseAdmin()
    .from('clientes')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', clienteId)

  revalidatePath(`/vendedor/clientes/${clienteId}`)
  revalidatePath('/vendedor/clientes')
  revalidatePath('/admin/clientes')
}

export async function deleteNota(notaId: string, clienteId: string) {
  await getSupabaseAdmin().from('notas_cliente').delete().eq('id', notaId)
  revalidatePath(`/vendedor/clientes/${clienteId}`)
}
