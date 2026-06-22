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
    "Crédito y financiación",
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
  { label: "Quiénes Somos", href: "#info" },
  { label: "Contacto", href: "#footer" },
] as const

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
