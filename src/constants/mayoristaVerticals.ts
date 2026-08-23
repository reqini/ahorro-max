import type { FaqItem } from '@/lib/faqs'
import { MAYORISTA_MIN_MONTO, buildWhatsAppUrl } from '@/constants'
import type { CATEGORIAS_LISTA } from '@/constants/catalogo'

export interface MayoristaVertical {
  slug: string
  badge: string
  h1: string
  description: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  categoriasDestacadas: (typeof CATEGORIAS_LISTA)[number][]
  puntos: string[]
  whatsappUrl: string
  faqs: FaqItem[]
}

export const MAYORISTA_VERTICALS: MayoristaVertical[] = [
  {
    slug: 'mayorista-para-kioscos',
    badge: 'Mayorista para kioscos',
    h1: 'Mayorista de bebidas para kioscos',
    description:
      'Gaseosas, energizantes y aguas al precio que necesita tu kiosco para no perder margen. Reponé rápido y sin faltantes con entrega programada en tu zona.',
    metaTitle: 'Mayorista de Bebidas para Kioscos en Ciudadela',
    metaDescription:
      'Precios mayoristas de gaseosas, energizantes y aguas para kioscos y maxikioscos en Ciudadela y zona oeste del GBA. Pedí tu lista por WhatsApp.',
    keywords: [
      'mayorista de bebidas para kioscos',
      'proveedor de kioscos zona oeste',
      'distribuidora de gaseosas para kioscos',
      'mayorista energizantes para kioscos',
      'proveedor mayorista kiosco Ciudadela',
    ],
    categoriasDestacadas: ['Gaseosas', 'Energizantes', 'Aguas y jugos'],
    puntos: [
      'Reposición rápida para que nunca te falte lo que más rota',
      'Gaseosas, energizantes y aguas de las marcas que pide tu cliente',
      'Entrega programada, sin que tengas que ir a buscar mercadería',
    ],
    whatsappUrl: buildWhatsAppUrl('Hola! Tengo un kiosco y quiero consultar precios mayoristas de bebidas 🧃'),
    faqs: [
      { id: 'kioscos-1', q: '¿Puedo pedir solo gaseosas y energizantes, sin el resto del catálogo?', a: 'Sí, armás el pedido con lo que necesites. No hace falta llevar todas las categorías.' },
      { id: 'kioscos-2', q: '¿Cuál es el pedido mínimo para kioscos?', a: `Como con cualquier pedido mayorista, el mínimo es de ${MAYORISTA_MIN_MONTO}.` },
      { id: 'kioscos-3', q: '¿Entregan en el kiosco o hay que retirar?', a: 'Entregamos en tu local según la zona y el día que te corresponda. Consultá tu zona por WhatsApp.' },
      { id: 'kioscos-4', q: '¿Con qué frecuencia puedo pedir?', a: 'Podés pedir cada vez que necesites reponer stock; muchos kioscos piden todas las semanas.' },
    ],
  },
  {
    slug: 'mayorista-para-almacenes',
    badge: 'Mayorista para almacenes',
    h1: 'Mayorista de bebidas para almacenes',
    description:
      'Surtí tu almacén con la variedad de bebidas que buscan tus clientes: gaseosas, cervezas, aguas, aperitivos y energizantes, a precio de distribuidora.',
    metaTitle: 'Mayorista de Bebidas para Almacenes en Ciudadela',
    metaDescription:
      'Distribuidora mayorista de bebidas para almacenes y despensas en Ciudadela y zona oeste del GBA. Gaseosas, cervezas, aguas y aperitivos. Pedí por WhatsApp.',
    keywords: [
      'mayorista de bebidas para almacenes',
      'distribuidora para almacenes zona oeste',
      'proveedor mayorista almacén Ciudadela',
      'distribuidora bebidas despensa',
    ],
    categoriasDestacadas: ['Gaseosas', 'Energizantes', 'Aguas y jugos', 'Cervezas', 'Aperitivos'],
    puntos: [
      'Todas las categorías de bebidas en un solo proveedor',
      'Precios por volumen para que tu margen no se achique',
      'Lista de precios actualizada para que cotices sin sorpresas',
    ],
    whatsappUrl: buildWhatsAppUrl('Hola! Tengo un almacén y quiero consultar precios mayoristas de bebidas 🛒'),
    faqs: [
      { id: 'almacenes-1', q: '¿Tienen productos de almacén además de bebidas?', a: 'Sí, el catálogo también incluye productos de almacén y de kiosco. Consultanos por WhatsApp qué necesitás.' },
      { id: 'almacenes-2', q: '¿Cuál es el mínimo de compra mayorista?', a: `El mínimo para acceder a precio mayorista es de ${MAYORISTA_MIN_MONTO} por pedido.` },
      { id: 'almacenes-3', q: '¿Hacen entrega en mi zona?', a: 'Entregamos en Zona Oeste (miércoles y sábados) y Zona CABA (martes y viernes). Consultá tu barrio por WhatsApp.' },
      { id: 'almacenes-4', q: '¿Cómo consulto precios actualizados?', a: 'Escribinos por WhatsApp y te pasamos la lista de precios vigente.' },
    ],
  },
  {
    slug: 'mayorista-para-restaurantes',
    badge: 'Mayorista para restaurantes y bares',
    h1: 'Mayorista de bebidas para restaurantes y bares',
    description:
      'Cervezas, aperitivos, aguas y gaseosas al precio que tu barra necesita, con entrega programada para que nunca te falte stock en el servicio.',
    metaTitle: 'Mayorista de Bebidas para Restaurantes y Bares',
    metaDescription:
      'Distribuidora mayorista de cervezas, aperitivos, aguas y gaseosas para restaurantes y bares en Ciudadela y zona oeste del GBA. Pedí por WhatsApp.',
    keywords: [
      'mayorista de bebidas para restaurantes',
      'mayorista de bebidas para bares',
      'distribuidora de cerveza para bares',
      'proveedor mayorista de aperitivos',
      'distribuidora de bebidas para gastronomía',
    ],
    categoriasDestacadas: ['Cervezas', 'Aperitivos', 'Aguas y jugos', 'Gaseosas'],
    puntos: [
      'Marcas de cerveza y aperitivos que pide tu carta',
      'Entrega programada para no quedarte sin stock a mitad de servicio',
      'Precios mayoristas para cuidar el margen de la barra',
    ],
    whatsappUrl: buildWhatsAppUrl('Hola! Tengo un restaurante/bar y quiero consultar precios mayoristas de bebidas 🍺'),
    faqs: [
      { id: 'restaurantes-1', q: '¿Qué cervezas y aperitivos manejan?', a: 'Manejamos las marcas más pedidas: Quilmes, Heineken, Corona, Stella Artois y Andes entre las cervezas, y Fernet Branca, Aperol y Campari entre los aperitivos. Consultá disponibilidad y precio actual por WhatsApp.' },
      { id: 'restaurantes-2', q: '¿Puedo coordinar entregas fijas todas las semanas?', a: 'Sí, podés coordinar un día de entrega fijo según tu zona para no tener que estar pidiendo cada vez.' },
      { id: 'restaurantes-3', q: '¿Cuál es el pedido mínimo?', a: `El mínimo para precio mayorista es de ${MAYORISTA_MIN_MONTO} por pedido.` },
      { id: 'restaurantes-4', q: '¿A qué zonas entregan?', a: 'Zona Oeste (miércoles y sábados) y Zona CABA (martes y viernes). Consultá tu zona por WhatsApp.' },
    ],
  },
  {
    slug: 'mayorista-para-eventos',
    badge: 'Mayorista para eventos',
    h1: 'Bebidas por mayor para tu evento',
    description:
      'Cervezas, gaseosas, aperitivos y aguas en cantidad para fiestas, cumpleaños y eventos corporativos, a precio mayorista y con entrega coordinada.',
    metaTitle: 'Bebidas por Mayor para Eventos en Ciudadela',
    metaDescription:
      'Cervezas, gaseosas, aperitivos y aguas por mayor para eventos y fiestas en Ciudadela y zona oeste del GBA. Coordiná tu pedido por WhatsApp.',
    keywords: [
      'bebidas por mayor para eventos',
      'mayorista de bebidas para fiestas',
      'distribuidora de cerveza para eventos',
      'bebidas al por mayor Ciudadela',
    ],
    categoriasDestacadas: ['Cervezas', 'Gaseosas', 'Aperitivos', 'Aguas y jugos'],
    puntos: [
      'Comprá en cantidad al precio que pagan los comercios, no el minorista',
      'Coordiná la entrega para el día de tu evento',
      'Cervezas, gaseosas y aperitivos de las marcas más pedidas',
    ],
    whatsappUrl: buildWhatsAppUrl('Hola! Estoy organizando un evento y quiero consultar precios mayoristas de bebidas 🎉'),
    faqs: [
      { id: 'eventos-1', q: '¿Con cuánta anticipación tengo que pedir?', a: 'Cuanto antes mejor, así coordinamos cantidad y entrega con tranquilidad. Escribinos por WhatsApp apenas tengas la fecha.' },
      { id: 'eventos-2', q: '¿Hay un pedido mínimo para eventos?', a: `Se aplica el mismo mínimo mayorista de ${MAYORISTA_MIN_MONTO} por pedido.` },
      { id: 'eventos-3', q: '¿Entregan el día del evento?', a: 'Coordinamos el día y horario de entrega según tu zona. Consultalo por WhatsApp al armar el pedido.' },
      { id: 'eventos-4', q: '¿Puedo pedir cantidades grandes para un evento masivo?', a: 'Sí, contanos cuántas personas esperás y armamos el pedido acorde. Escribinos por WhatsApp.' },
    ],
  },
]
