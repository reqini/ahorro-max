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
