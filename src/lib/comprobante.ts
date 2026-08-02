import type { PedidoItem } from './pedidos'

/**
 * Normaliza un teléfono argentino al formato que espera wa.me: 54 + 9 + área +
 * número, sin ceros ni 15. Devuelve '' si no parece un teléfono usable.
 *
 * Acepta lo que el vendedor escribe en la calle: "11 5020-3114", "01150203114",
 * "+54 9 11 5020 3114", "15 5020 3114".
 */
export function telefonoAWhatsApp(entrada: string): string {
  let n = (entrada ?? '').replace(/\D/g, '')
  if (!n) return ''

  // Prefijo internacional escrito como 0054.
  if (n.startsWith('0054')) n = n.slice(2)
  // Ya viene con 54: se normaliza el 9 más abajo.
  if (n.startsWith('54')) n = n.slice(2)
  if (n.startsWith('9')) n = n.slice(1)
  // 0 de larga distancia: no va en el formato internacional.
  if (n.startsWith('0')) n = n.slice(1)

  // El 15 del celular va entre la característica y el abonado ("011 15 5020-3114").
  // Un número completo tiene 10 dígitos, así que si hay 12 sobra justamente el 15;
  // las características argentinas son de 2, 3 o 4 dígitos.
  if (n.length === 12) {
    for (const corte of [2, 3, 4]) {
      if (n.slice(corte, corte + 2) === '15') {
        n = n.slice(0, corte) + n.slice(corte + 2)
        break
      }
    }
  }
  if (n.length > 10 && n.startsWith('15')) n = n.slice(2)

  // "15 5020-3114" son 10 dígitos pero sin característica: el 15 no es un código
  // de área (ninguno empieza en 15), así que no se puede saber la zona. Se rechaza
  // para que el vendedor lo escriba completo en vez de mandarlo a un número ajeno.
  if (n.length === 10 && n.startsWith('15')) return ''

  // Un número argentino sin prefijos son 10 dígitos (área + abonado).
  if (n.length < 10) return ''
  n = n.slice(-10)

  return `549${n}`
}

/** Formatea un importe como precio argentino: 15750 -> "$15.750". */
export function moneda(valor: string | number): string {
  const n = typeof valor === 'number' ? valor : Number(String(valor).replace(/[^\d.-]/g, ''))
  if (!Number.isFinite(n)) return String(valor)
  return `$${n.toLocaleString('es-AR')}`
}

function subtotal(item: PedidoItem): number {
  const precio = Number(String(item.precio).replace(/[^\d.-]/g, ''))
  return Number.isFinite(precio) ? precio * item.cantidad : 0
}

export interface DatosComprobante {
  numero: number | null
  cliente_nombre: string
  items: PedidoItem[]
  tipo_precio: 'minorista' | 'mayorista'
  total_estimado: string
  notas?: string
  created_at?: string
  /** Día pactado de entrega, en formato YYYY-MM-DD. */
  fecha_entrega?: string | null
}

/** Muestra una fecha YYYY-MM-DD como DD/MM/AAAA, sin corrimientos por zona horaria. */
export function formatearFecha(fechaISO: string): string {
  const [a, m, d] = fechaISO.split('-').map(Number)
  if (!a || !m || !d) return fechaISO
  return new Date(a, m - 1, d).toLocaleDateString('es-AR')
}

/** Datos de la distribuidora que encabezan el comprobante. Los carga el admin. */
export interface DatosEmpresa {
  razon_social: string
  cuit: string
  domicilio: string
}

/**
 * Esto NO es una factura: no lleva CAE ni CAI, así que no es un comprobante
 * fiscal. La leyenda va siempre para que no haya ninguna ambigüedad sobre qué
 * está recibiendo el cliente.
 */
export const LEYENDA_NO_FISCAL = 'Documento no válido como factura'

/**
 * Texto del comprobante que se manda por WhatsApp. Usa el formato de negrita de
 * WhatsApp (*texto*) y va sin sangrías para que se lea bien en el celular.
 */
export function textoComprobante(pedido: DatosComprobante, empresa?: DatosEmpresa): string {
  const fecha = pedido.created_at ? new Date(pedido.created_at) : new Date()
  const lineas: string[] = []

  // El CUIT queda fuera del mensaje a propósito: no es una factura y al cliente
  // no le aporta nada. Sigue estando en la pantalla de conformidad que firma.
  lineas.push(`*${empresa?.razon_social?.trim() || 'AHORRA MAX'}*`)
  if (empresa?.domicilio?.trim()) lineas.push(empresa.domicilio.trim())

  lineas.push('')
  lineas.push('*NOTA DE PEDIDO*')
  lineas.push(
    pedido.numero ? `N° ${pedido.numero} — ${fecha.toLocaleDateString('es-AR')}` : fecha.toLocaleDateString('es-AR')
  )
  if (pedido.cliente_nombre) lineas.push(`Cliente: ${pedido.cliente_nombre}`)
  if (pedido.fecha_entrega) lineas.push(`Entrega: ${formatearFecha(pedido.fecha_entrega)}`)
  lineas.push('')

  for (const item of pedido.items) {
    lineas.push(`• ${item.nombre} x${item.cantidad} — ${moneda(subtotal(item))}`)
  }

  lineas.push('')
  lineas.push(`*Total: ${moneda(pedido.total_estimado)}*`)
  lineas.push(`Lista ${pedido.tipo_precio}`)

  if (pedido.notas) {
    lineas.push('')
    lineas.push(`Nota: ${pedido.notas}`)
  }

  lineas.push('')
  lineas.push('Gracias por tu compra. Los precios pueden variar hasta la confirmación del pedido.')
  lineas.push(`_${LEYENDA_NO_FISCAL}_`)

  return lineas.join('\n')
}

/**
 * Aviso de entrega. Si además quedó pagado lo deja asentado en el mismo mensaje;
 * si no, le recuerda al cliente el saldo pendiente.
 */
export function textoEntrega(
  pedido: DatosComprobante,
  empresa: DatosEmpresa | undefined,
  pagado: boolean
): string {
  const lineas: string[] = []

  lineas.push(`*${empresa?.razon_social?.trim() || 'AHORRA MAX'}*`)
  lineas.push('')
  lineas.push(
    pedido.numero ? `Tu pedido N° ${pedido.numero} fue entregado.` : 'Tu pedido fue entregado.'
  )
  lineas.push(`Fecha: ${new Date().toLocaleDateString('es-AR')}`)
  lineas.push('')

  if (pagado) {
    lineas.push(`*Total abonado: ${moneda(pedido.total_estimado)}*`)
    lineas.push('Pedido entregado y pagado. ¡Gracias!')
  } else {
    lineas.push(`*Total a abonar: ${moneda(pedido.total_estimado)}*`)
    lineas.push('Queda pendiente el pago. ¡Gracias por tu compra!')
  }

  lineas.push('')
  lineas.push(`_${LEYENDA_NO_FISCAL}_`)
  return lineas.join('\n')
}

/** Aviso de que se registró el pago de un pedido que había quedado a cuenta. */
export function textoPago(pedido: DatosComprobante, empresa?: DatosEmpresa): string {
  const lineas: string[] = []

  lineas.push(`*${empresa?.razon_social?.trim() || 'AHORRA MAX'}*`)
  lineas.push('')
  lineas.push(
    pedido.numero
      ? `Registramos el pago de tu pedido N° ${pedido.numero}.`
      : 'Registramos el pago de tu pedido.'
  )
  lineas.push(`Fecha: ${new Date().toLocaleDateString('es-AR')}`)
  lineas.push('')
  lineas.push(`*Total pagado: ${moneda(pedido.total_estimado)}*`)
  lineas.push('Cuenta saldada. ¡Gracias!')
  lineas.push('')
  lineas.push(`_${LEYENDA_NO_FISCAL}_`)
  return lineas.join('\n')
}

/** Arma el link de WhatsApp para cualquiera de los mensajes de arriba. */
export function linkWhatsApp(telefono: string, texto: string): string {
  const numero = telefonoAWhatsApp(telefono)
  const mensaje = encodeURIComponent(texto)
  return numero ? `https://wa.me/${numero}?text=${mensaje}` : `https://wa.me/?text=${mensaje}`
}

/** Link que abre WhatsApp con el comprobante listo para enviar. */
export function linkWhatsAppComprobante(
  telefono: string,
  pedido: DatosComprobante,
  empresa?: DatosEmpresa
): string {
  const numero = telefonoAWhatsApp(telefono)
  const texto = encodeURIComponent(textoComprobante(pedido, empresa))
  return numero ? `https://wa.me/${numero}?text=${texto}` : `https://wa.me/?text=${texto}`
}
