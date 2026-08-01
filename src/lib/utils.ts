export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ")
}

/**
 * Formatea un importe como precio argentino, con separador de miles: 104325
 * pasa a "$104.325". Acepta lo que venga (número, "104325", "$104325") porque los
 * precios se guardan como texto y en distintos formatos según de dónde salieron.
 * Devuelve null si no hay nada que mostrar, para poder omitir el precio.
 */
export function formatearPrecio(valor: string | number | null | undefined): string | null {
  if (valor === null || valor === undefined || valor === "") return null

  const n = typeof valor === "number" ? valor : parsearPrecio(valor)
  // Si no es un número (por ejemplo "consultar"), se muestra tal cual vino.
  if (!Number.isFinite(n)) return String(valor)

  return `$${Math.round(n).toLocaleString("es-AR")}`
}

/**
 * Convierte a número un precio escrito a la argentina, donde el punto separa
 * miles y la coma decimales. Sin esto, "$104.325" se leería como 104,325 y el
 * total quedaría mil veces más chico.
 */
export function parsearPrecio(valor: string): number {
  const texto = String(valor)
  // Sin dígitos no hay precio ("consultar", "a confirmar"): devolver 0 haría que
  // se mostrara "$0", que es peor que no mostrar nada.
  if (!/\d/.test(texto)) return NaN

  const limpio = texto.replace(/[^\d,.-]/g, "")
  const sinMiles = limpio.replace(/\.(?=\d{3}(\D|$))/g, "")
  return Number(sinMiles.replace(",", "."))
}

export function smoothScrollTo(id: string): void {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: "smooth" })
  }
}
