import type { ComparacionPrecio } from './productos'
import { parsearPrecio } from './utils'

export interface AhorroCalculado {
  /** Comparación más cara de la competencia (contra la que más se ahorra). */
  referencia: ComparacionPrecio
  ahorroPesos: number
  ahorroPorcentaje: number
}

/**
 * Calcula cuánto se ahorra el cliente comprando en Ahorra Max en vez de la cadena
 * más cara que cargó el admin. Devuelve null si no hay comparación válida o si el
 * precio propio no es más barato (no inventamos una ventaja que no existe).
 */
export function calcularAhorro(
  precioPropio: string,
  comparaciones: ComparacionPrecio[]
): AhorroCalculado | null {
  const propio = parsearPrecio(precioPropio)
  if (!Number.isFinite(propio) || propio <= 0) return null

  let mejor: AhorroCalculado | null = null
  for (const c of comparaciones) {
    const ref = parsearPrecio(c.precio)
    if (!Number.isFinite(ref) || ref <= propio) continue

    const ahorroPesos = ref - propio
    if (!mejor || ahorroPesos > mejor.ahorroPesos) {
      mejor = {
        referencia: c,
        ahorroPesos,
        ahorroPorcentaje: Math.round((ahorroPesos / ref) * 100),
      }
    }
  }
  return mejor
}
