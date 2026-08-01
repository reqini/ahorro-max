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

export interface ClienteRapido {
  id: string
  nombre: string
  telefono: string
}

/**
 * Alta de cliente desde el formulario de pedido: crea lo mínimo y devuelve el
 * cliente en vez de redirigir, para que el vendedor siga cargando el pedido sin
 * perder lo que ya venía armando.
 */
export interface DatosClienteRapido {
  nombre: string
  tipo?: TipoCliente
  tipo_negocio?: string
  contacto?: string
  telefono?: string
  direccion?: string
  horarios?: string
  dia_visita?: string
  metodo_contacto?: string
  zona_ruta?: string
  nota?: string
}

export async function crearClienteRapido(
  datos: DatosClienteRapido
): Promise<{ cliente?: ClienteRapido; error?: string }> {
  const vendedor = await getVendedorUsername()
  if (!vendedor) return { error: 'Sin sesión' }

  const nombre = datos.nombre.trim()
  if (!nombre) return { error: 'Poné el nombre del cliente' }

  const limpio = (v?: string) => (v ?? '').trim()
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('clientes')
    .insert({
      nombre,
      tipo: datos.tipo ?? 'potencial',
      tipo_negocio: limpio(datos.tipo_negocio),
      contacto: limpio(datos.contacto),
      telefono: limpio(datos.telefono),
      direccion: limpio(datos.direccion),
      horarios: limpio(datos.horarios),
      dia_visita: limpio(datos.dia_visita),
      metodo_contacto: limpio(datos.metodo_contacto),
      zona_ruta: limpio(datos.zona_ruta),
      estado: 'activo',
      vendedor,
    })
    .select('id, nombre, telefono')
    .single()

  if (error || !data) return { error: error?.message ?? 'No se pudo crear el cliente' }

  const nota = limpio(datos.nota)
  if (nota) await supabase.from('notas_cliente').insert({ cliente_id: data.id, texto: nota })

  revalidatePath('/vendedor/clientes')
  revalidatePath('/admin/clientes')
  return { cliente: { id: data.id as string, nombre: data.nombre as string, telefono: (data.telefono as string) ?? '' } }
}
