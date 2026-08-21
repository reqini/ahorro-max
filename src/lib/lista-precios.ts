/**
 * Lectura de la lista de precios tal como la escribe el negocio en Excel: un
 * título arriba, secciones por categoría, el encabezado repetido en cada sección
 * y cinco columnas (producto, presentación, pack cerrado, unitario del pack,
 * unitario por menor).
 *
 * Se lee ese formato en vez de pedir que lo reescriban en otro: la lista se arma
 * todos los meses igual y tiene que poder importarse tal cual sale.
 */

/** Marcas conocidas de la lista, con el nombre bien escrito para el catálogo. */
const MARCAS: [clave: string, marca: string, nombre: string][] = [
  ['COCA COLA ZERO', 'Coca-Cola', 'Coca-Cola Zero'],
  ['COCA COLA', 'Coca-Cola', 'Coca-Cola'],
  ['SPRITE ZERO', 'Sprite', 'Sprite Zero'],
  ['SPRITE', 'Sprite', 'Sprite'],
  ['PEPSI BLACK', 'Pepsi', 'Pepsi Black'],
  ['PEPSI', 'Pepsi', 'Pepsi'],
  ['SEVEN UP', 'Seven Up', 'Seven Up'],
  ['SEVEN FREE', 'Seven Up', 'Seven Up Free'],
  ['PASO DE LOS TOROS TONICA', 'Paso de los Toros', 'Paso de los Toros Tónica'],
  ['PASO DE LOS TOROS POMELO', 'Paso de los Toros', 'Paso de los Toros Pomelo'],
  ['SPEED XL', 'Speed', 'Speed XL'],
  ['SPEED ENERGIZANTE', 'Speed', 'Speed Energizante'],
  ['RED BULL', 'Red Bull', 'Red Bull'],
  ['AGUA ECO DE LOS ANDES', 'Eco de los Andes', 'Agua Eco de los Andes'],
  ['AGUA GLACIAR', 'Glaciar', 'Agua Glaciar'],
  ['AGUA VILLAVICENCIO PREMIUM', 'Villavicencio', 'Agua Villavicencio Premium'],
  ['AGUA VILLAVICENCIO CON GAS', 'Villavicencio', 'Agua Villavicencio con gas'],
  ['AGUA VILLAVICENCIO', 'Villavicencio', 'Agua Villavicencio'],
  ['AGUA SIERRA DE LOS PADRES', 'Sierra de los Padres', 'Agua Sierra de los Padres'],
  ['CEPITA NARANJA', 'Cepita', 'Cepita Naranja'],
  ['CERVEZA QUILMES 0%', 'Quilmes', 'Cerveza Quilmes 0%'],
  ['CERVEZA QUILMES', 'Quilmes', 'Cerveza Quilmes'],
  ['CERVEZA SCHENEIDER REMIX LIMON', 'Schneider', 'Cerveza Schneider Remix Limón'],
  ['CERVEZA SCHENEIDER LATON', 'Schneider', 'Cerveza Schneider Latón'],
  ['CERVEZA SCHENEIDER', 'Schneider', 'Cerveza Schneider'],
  ['CERVEZA AMSTEL LATON', 'Amstel', 'Cerveza Amstel Latón'],
  ['CERVEZA AMSTEL', 'Amstel', 'Cerveza Amstel'],
  ['CERVEZA ISEMBECK', 'Isenbeck', 'Cerveza Isenbeck'],
  ['CERVEZA GROLSH', 'Grolsch', 'Cerveza Grolsch'],
  ['CERVEZA BUDWAISER', 'Budweiser', 'Cerveza Budweiser'],
  ['CERVEZA MICHELOB ULTRA', 'Michelob', 'Cerveza Michelob Ultra'],
  ['CERVEZA ANDES IPA', 'Andes', 'Cerveza Andes IPA'],
  ['CERVEZA ANDES ROJA', 'Andes', 'Cerveza Andes Roja'],
  ['CERVEZA ANDES NEGRA', 'Andes', 'Cerveza Andes Negra'],
  ['CERVEZA ANDES RUBIA', 'Andes', 'Cerveza Andes Rubia'],
  ['CERVEZA STELLA PORRON', 'Stella Artois', 'Cerveza Stella Artois Porrón'],
  ['CERVEZA STELLA', 'Stella Artois', 'Cerveza Stella Artois'],
  ['CERVEZA HEINEKEN PORRON', 'Heineken', 'Cerveza Heineken Porrón'],
  ['CERVEZA HEINEKEN LATON', 'Heineken', 'Cerveza Heineken Latón'],
  ['CERVEZA HEINEKEN', 'Heineken', 'Cerveza Heineken'],
  ['CERVEZA WASTEINER', 'Warsteiner', 'Cerveza Warsteiner'],
  ['CERVEZA CORONA PORRON', 'Corona', 'Cerveza Corona Porrón'],
  ['CERVEZA CORONA 0%', 'Corona', 'Cerveza Corona 0%'],
  ['CERVEZA SOL PORRON', 'Sol', 'Cerveza Sol Porrón'],
  ['FERNET BRANCA', 'Branca', 'Fernet Branca'],
  ['APEROL', 'Aperol', 'Aperol'],
  ['CAMPARI', 'Campari', 'Campari'],
  ['CYNAR', 'Cynar', 'Cynar'],
  ['JAGGER', 'Jägermeister', 'Jägermeister'],
  ['GANCIA', 'Gancia', 'Gancia'],
]

/** Cómo se escriben las categorías de la lista en el catálogo. */
const CATEGORIAS: Record<string, string> = {
  'GASEOSAS': 'Gaseosas',
  'ENERGIZANTES': 'Energizantes',
  'AGUAS Y JUGOS': 'Aguas y jugos',
  'CERVEZAS': 'Cervezas',
  'APERITIVOS': 'Aperitivos',
}

export interface FilaLista {
  nombre: string
  marca: string
  categoria: string
  presentacion: string
  /** Precio de la unidad suelta: el que paga el consumidor final. */
  precio_minorista: string
  /** Precio de la unidad llevando el pack cerrado. */
  precio_mayorista: string
  precio_pack: string
}

function texto(v: unknown): string {
  return String(v ?? '').trim()
}

function soloDigitos(v: string): string {
  const limpio = v.replace(/[^\d]/g, '')
  return limpio
}

/** "1,75lts" → "1,75L"; "354ml" → "354ml"; "2Lts" → "2L". */
function formatearVolumen(v: string): string {
  const m = /^(\d+(?:[.,]\d+)?)\s*(ml|lts?|l)$/i.exec(v.trim())
  if (!m) return v.trim()
  return m[2].toLowerCase() === 'ml' ? `${m[1]}ml` : `${m[1]}L`
}

/** Pasa a mayúsculas sin tildes, para comparar contra la tabla de marcas. */
function normalizar(v: string): string {
  return v
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim()
}

function titulo(v: string): string {
  return v
    .toLowerCase()
    .replace(/(^|\s)(\p{L})/gu, (_, sep: string, letra: string) => sep + letra.toUpperCase())
}

interface NombreLimpio {
  base: string
  marca: string
  lata: boolean
  volumen: string
}

/**
 * Separa lo que la lista mezcla en una sola celda: "LATA COCA COLA ZERO" es un
 * envase (lata) más un producto (Coca-Cola Zero), y "FERNET BRANCA 750ml" trae el
 * volumen pegado al nombre. Si la marca no está en la tabla, el nombre se usa tal
 * cual: es preferible importar un producto sin marca que perderlo.
 */
function limpiarNombre(crudo: string): NombreLimpio {
  let txt = normalizar(crudo)

  const lata = txt.startsWith('LATA ')
  if (lata) txt = txt.slice(5).trim()

  let volumen = ''
  const m = /(\d+(?:[.,]\d+)?\s*(?:ML|LTS?|L))$/i.exec(txt)
  if (m) {
    volumen = formatearVolumen(m[1])
    txt = txt.slice(0, m.index).trim()
  }

  for (const [clave, marca, nombre] of MARCAS) {
    if (txt === clave || txt.startsWith(clave)) {
      return { base: nombre, marca, lata, volumen }
    }
  }
  return { base: titulo(txt), marca: '', lata, volumen }
}

/** "x24 473ml" → { unidades: 24, volumen: "473ml" }; "x12" → { unidades: 12 }. */
function parsearPresentacion(pres: string): { unidades: number; volumen: string } | null {
  const m = /^x\s*(\d+)\s*(.*)$/i.exec(pres.trim())
  if (!m) return null
  return { unidades: Number(m[1]), volumen: formatearVolumen(m[2]) }
}

/**
 * ¿Estas filas son la lista de precios minorista? Se reconoce por el encabezado
 * de sección, que siempre trae producto + presentación.
 */
export function esListaDePrecios(filas: unknown[][]): boolean {
  return filas.some((fila) => {
    const celdas = fila.map((c) => normalizar(texto(c)))
    return celdas.includes('PRODUCTO') && celdas.some((c) => c.startsWith('PRESENTACI'))
  })
}

/**
 * Convierte la lista de precios en productos del catálogo. Descarta el título, las
 * filas de categoría y los encabezados repetidos; lo que no tenga presentación ni
 * precios no es un artículo.
 */
export function parsearListaMinorista(filas: unknown[][]): FilaLista[] {
  const productos: FilaLista[] = []
  let categoria = ''

  for (const fila of filas) {
    const nombreCrudo = texto(fila[0])
    const presentacion = texto(fila[1])
    const precioPack = soloDigitos(texto(fila[2]))
    const unitarioPack = soloDigitos(texto(fila[3]))
    const unitarioSuelto = soloDigitos(texto(fila[4]))

    if (!nombreCrudo) continue

    const clave = normalizar(nombreCrudo)
    if (CATEGORIAS[clave]) {
      categoria = CATEGORIAS[clave]
      continue
    }
    // Una fila con nombre y nada más es un título de sección: sirve de categoría
    // aunque no esté en la tabla, así una lista nueva no pierde su agrupación.
    if (!presentacion && !precioPack && !unitarioPack) {
      if (!/\d/.test(nombreCrudo) && nombreCrudo.length <= 40) categoria = titulo(nombreCrudo)
      continue
    }
    if (clave === 'PRODUCTO') continue
    if (!presentacion || (!precioPack && !unitarioPack)) continue

    const { base, marca, lata, volumen: volNombre } = limpiarNombre(nombreCrudo)
    const pres = parsearPresentacion(presentacion)
    if (!pres) continue

    const volumen = pres.volumen || volNombre
    // El pack de 6 y el de 24 del mismo producto son artículos distintos: el
    // nombre tiene que decirlo o se pisan entre ellos al importar.
    const nombre = [base, lata ? 'Lata' : '', volumen, `x${pres.unidades}`]
      .filter(Boolean)
      .join(' ')

    productos.push({
      nombre,
      marca,
      categoria,
      presentacion: `Pack x${pres.unidades}${volumen ? ` · ${volumen}` : ''}${lata ? ' · lata' : ''}`,
      // Sin precio por menor, el artículo solo se vende por pack cerrado y la
      // unidad vale lo mismo que dentro del pack.
      precio_minorista: unitarioSuelto || unitarioPack,
      precio_mayorista: unitarioPack,
      precio_pack: precioPack,
    })
  }

  return productos
}
