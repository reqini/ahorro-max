import { CATEGORIAS_LISTA, ZONAS_DETALLE } from '@/constants'

/**
 * Nombre de archivo/identificador a partir de un texto: sin tildes, sin signos y
 * con guiones. "Cerveza Quilmes 473ml x24" → "cerveza-quilmes-473ml-x24".
 * Es el puente entre el nombre del producto y el archivo de su foto.
 */
export function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

/** Slug de cada categoria real de la lista de precios, para las rutas /productos/[categoria]. */
export const CATEGORIA_SLUGS: Record<string, string> = Object.fromEntries(
  CATEGORIAS_LISTA.map((c) => [c, slugify(c)])
)

/** Del slug de la URL a la categoria real (con tildes/mayusculas correctas). */
export const SLUG_TO_CATEGORIA: Record<string, string> = Object.fromEntries(
  CATEGORIAS_LISTA.map((c) => [slugify(c), c])
)

/** Slug de cada barrio real de ZONAS_DETALLE, para las rutas /zona-de-cobertura/[localidad]. */
export const LOCALIDAD_SLUGS: Record<string, string> = Object.fromEntries(
  ZONAS_DETALLE.flatMap((zona) => zona.barrios).map((barrio) => [barrio, slugify(barrio)])
)
