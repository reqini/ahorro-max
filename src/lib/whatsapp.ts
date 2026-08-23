import { getSiteConfig } from './config'
import {
  WHATSAPP_NUMBER,
  WHATSAPP_MINORISTA_MSG,
  WHATSAPP_MAYORISTA_MSG,
  TELEFONO_DISPLAY,
  buildWhatsAppUrl,
} from '@/constants/contact'

export interface ContactInfo {
  numero: string
  telefonoDisplay: string
  minorista: string
  mayorista: string
}

/**
 * Teléfono y mensajes de WhatsApp, tomados de lo que haya configurado el admin en
 * /admin/config (`whatsapp_number`, `telefono`, `whatsapp_msg_minorista`,
 * `whatsapp_msg_mayorista`), con el valor fijo del código como respaldo. Antes de
 * esto, esos campos del admin se guardaban pero ningún link del sitio los leía.
 */
export async function getContactInfo(): Promise<ContactInfo> {
  const config = await getSiteConfig()
  const numero = config.whatsapp_number || WHATSAPP_NUMBER
  return {
    numero,
    telefonoDisplay: config.telefono || TELEFONO_DISPLAY,
    minorista: buildWhatsAppUrl(config.whatsapp_msg_minorista || WHATSAPP_MINORISTA_MSG, numero),
    mayorista: buildWhatsAppUrl(config.whatsapp_msg_mayorista || WHATSAPP_MAYORISTA_MSG, numero),
  }
}
