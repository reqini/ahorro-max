export const WHATSAPP_NUMBER = "5491150203114"

export const WHATSAPP_MINORISTA_MSG =
  "Hola! Vi su página y quiero consultar como minorista 🛒"

export const WHATSAPP_MAYORISTA_MSG =
  "Hola! Vi su página y quiero consultar precios mayoristas 📦"

export const DIRECCION = "25 de mayo 108, Ciudadela, CP 1702"

export const TELEFONO_DISPLAY = "11 5020-3114"

export const EMAIL = "info@ahorramax.com.ar"

export const SOCIAL_LINKS = {
  instagram: "#",
  facebook: "#",
}

export const HORARIOS = [
  { dias: "Lunes a Viernes", horario: "8:00 - 18:00" },
  { dias: "Sábados", horario: "8:00 - 13:00" },
  { dias: "Domingos", horario: "Cerrado" },
]

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const WHATSAPP_MINORISTA_URL = buildWhatsAppUrl(WHATSAPP_MINORISTA_MSG)
export const WHATSAPP_MAYORISTA_URL = buildWhatsAppUrl(WHATSAPP_MAYORISTA_MSG)

export const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.3!2d-58.56!3d-34.62!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s25+de+Mayo+108%2C+Ciudadela!5e0!3m2!1ses!2sar!4v1234567890"

// TODO: Google Sheets integration — replace these with dynamic URLs from sheets
export const CATALOGO_MINORISTA_URL = "/catalogo-minorista.pdf"
export const LISTA_MAYORISTA_URL = "/catalogo-mayorista.pdf"
