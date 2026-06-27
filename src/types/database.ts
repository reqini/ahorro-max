export type ConfigKey =
  | 'telefono'
  | 'whatsapp_number'
  | 'whatsapp_msg_minorista'
  | 'whatsapp_msg_mayorista'
  | 'lista_minorista_url'
  | 'lista_mayorista_url'

export interface Sucursal {
  id: string
  nombre: string
  direccion: string
  telefono: string
  horarios: string
  maps_url: string
  activa: boolean
  orden: number
}

export interface Oferta {
  id: string
  tipo: 'minorista' | 'mayorista'
  nombre: string
  detalle: string
  precio: string
  activa: boolean
  orden: number
}
