import { getSupabaseAdmin } from './supabase'

export type TipoCliente = 'minorista' | 'mayorista' | 'potencial'
export type EstadoCliente = 'activo' | 'inactivo'

export interface Cliente {
  id: string
  nombre: string
  telefono: string
  direccion: string
  tipo: TipoCliente
  estado: EstadoCliente
  tipo_negocio: string
  contacto: string
  horarios: string
  dia_visita: string
  metodo_contacto: string
  vendedor: string
  zona_ruta: string
  created_at: string
  updated_at: string
}

export interface NotaCliente {
  id: string
  cliente_id: string
  texto: string
  created_at: string
}

export async function getClientes(filtro?: { tipo?: TipoCliente; busqueda?: string }): Promise<Cliente[]> {
  let query = getSupabaseAdmin()
    .from('clientes')
    .select('*')
    .order('updated_at', { ascending: false })

  if (filtro?.tipo) query = query.eq('tipo', filtro.tipo)
  if (filtro?.busqueda) query = query.ilike('nombre', `%${filtro.busqueda}%`)

  const { data } = await query
  return (data ?? []) as Cliente[]
}

export async function getCliente(id: string): Promise<Cliente | null> {
  const { data } = await getSupabaseAdmin()
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single()
  return (data ?? null) as Cliente | null
}

export async function getNotasCliente(clienteId: string): Promise<NotaCliente[]> {
  const { data } = await getSupabaseAdmin()
    .from('notas_cliente')
    .select('*')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false })
  return (data ?? []) as NotaCliente[]
}
