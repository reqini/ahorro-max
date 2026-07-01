export const HERO_CONTENT = {
  tagline: "Distribuidora Ahorra Max",
  headline: "Tu Distribuidora de Confianza",
  subheadline:
    "Productos de consumo masivo al mejor precio. Para consumidores finales y revendedores de toda la zona.",
  ctaMinorista: "Soy Minorista",
  ctaMayorista: "Soy Mayorista",
} as const

export const MINORISTA_CONTENT = {
  badge: "Para el consumidor final",
  headline: "Comprá al mejor precio",
  description:
    "Accedé a nuestros productos de consumo masivo con precios directos de distribuidora. Sin intermediarios, sin vueltas. Llevate lo que necesitás para tu hogar al precio justo.",
  features: [
    "Amplio stock de productos",
    "Precios directos de distribuidora",
    "Atención personalizada",
    "Retiro en local",
  ],
  ctaWhatsApp: "Contactanos",
  ctaCatalogo: "Descargar Catálogo",
} as const

export const MAYORISTA_CONTENT = {
  badge: "Para revendedores y comercios",
  headline: "Precios mayoristas que marcan la diferencia",
  description:
    "Si tenés un almacén, kiosco, maxiquiosco o sos revendedor, acá encontrás los mejores precios del mercado. Volúmenes grandes, precios chicos. Así trabajamos.",
  features: [
    "Precios por volumen",
    "Entrega programada",
    "Lista de precios actualizada",
  ],
  ctaWhatsApp: "Contactanos",
  ctaLista: "Descargar Catálogo",
} as const

export const INFO_CONTENT = {
  headline: "Dónde Encontrarnos",
  subheadline: "Venís, pedís, llevás. Simple como siempre.",
  mapPlaceholder: "Ver en Google Maps",
} as const

export const NAVBAR_LINKS = [
  { label: "Minorista", href: "#minorista" },
  { label: "Mayorista", href: "#mayorista" },
  { label: "Ofertas", href: "#ofertas" },
  { label: "Contacto", href: "#contacto" },
] as const

export const OFERTAS_CONTENT = {
  badge: "Esta semana",
  headline: "Ofertas de la Semana",
  description: "Precios especiales por tiempo limitado. Stock sujeto a disponibilidad.",
  minorista: {
    label: "Minorista",
    color: "red" as const,
    items: [
      { nombre: "Aceite girasol 1.5L", precio: "Consultá", detalle: "Pack x6" },
      { nombre: "Yerba mate 1kg", precio: "Consultá", detalle: "Unidad" },
      { nombre: "Arroz largo fino 1kg", precio: "Consultá", detalle: "Unidad" },
      { nombre: "Detergente 750ml", precio: "Consultá", detalle: "Pack x4" },
    ],
  },
  mayorista: {
    label: "Mayorista",
    color: "yellow" as const,
    items: [
      { nombre: "Aceite girasol 1.5L", precio: "Consultá", detalle: "Caja x12" },
      { nombre: "Yerba mate 1kg", precio: "Consultá", detalle: "Caja x20" },
      { nombre: "Arroz largo fino 1kg", precio: "Consultá", detalle: "Bolsa x25" },
      { nombre: "Detergente 750ml", precio: "Consultá", detalle: "Caja x12" },
    ],
  },
  nota: "* Precios actualizados semanalmente. Consultá disponibilidad de stock por WhatsApp.",
} as const

export const ZONAS_ENTREGA = {
  headline: "Entrega sin cargo",
  zonas: ["Ciudadela", "Ramos Mejía", "Luzuriaga", "Lomas del Mirador", "Villa Sarmiento"],
  nota: "Consultá condiciones mínimas de compra por WhatsApp",
} as const

export const CONTACTO_CONTENT = {
  badge: "Escribinos",
  headline: "¿Tenés alguna consulta?",
  description: "Completá el formulario y te respondemos a la brevedad.",
  labels: {
    nombre: "Nombre",
    telefono: "Teléfono",
    mensaje: "Mensaje",
    enviar: "Enviar por WhatsApp",
    enviando: "Enviando...",
    exito: "¡Listo! Se abrió WhatsApp con tu consulta.",
    error: "Hubo un error. Escribinos por WhatsApp.",
  },
} as const

export const FOOTER_CONTENT = {
  copyright: "© 2025 Distribuidora Ahorra Max. Todos los derechos reservados.",
  tagline: "Ciudadela, Buenos Aires",
} as const

// TODO: Google Sheets integration — CatalogItem type for future online catalog
export type CatalogItem = {
  id: string
  name: string
  category: string
  price: number
  priceWholesale?: number
  unit: string
  stock: boolean
  imageUrl?: string
}
