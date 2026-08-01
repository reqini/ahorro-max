import { getSupabaseAdmin } from './supabase'

export type GeoEstado = 'pendiente' | 'ok' | 'fallo'

/**
 * Traduce el error de Supabase a algo accionable. El caso más común al estrenar la
 * sección es que todavía no se corrió el SQL que crea las tablas.
 */
export function mensajeDeError(mensaje: string): string {
  if (/schema cache|does not exist|no existe la relación/i.test(mensaje)) {
    return 'Faltan las tablas de recorridos en la base. Ejecutá el archivo supabase/schema_recorridos.sql en el SQL Editor de Supabase y volvé a intentar.'
  }
  return mensaje
}

export interface Direccion {
  id: string
  direccion: string
  calle: string
  altura: number | null
  barrio: string
  localidad: string
  partido: string
  zona: string
  lat: number | null
  lng: number | null
  geo_estado: GeoEstado
  geo_query: string
  clave: string
  created_at: string
}

/** Fila lista para insertar: lo que sale del parseo del Excel. */
export type DireccionNueva = Omit<Direccion, 'id' | 'created_at' | 'lat' | 'lng' | 'geo_estado'>

// ---------------------------------------------------------------------------
// Parseo del Excel
// ---------------------------------------------------------------------------

// Las listas vienen con la calle en formato "invertido" y con aclaraciones entre
// paréntesis: "Sarmiento, Pte., Av. 5540 (esq Finochietto)". Para geocodificar hay
// que reconstruirla como la escribiría una persona: "Av. Sarmiento 5540".

const TIPOS_VIA: Record<string, string> = {
  av: 'Av.',
  avda: 'Av.',
  avenida: 'Av.',
  diag: 'Diag.',
  diagonal: 'Diag.',
  bv: 'Bv.',
  blvd: 'Bv.',
  boulevard: 'Bv.',
  bulevar: 'Bv.',
  pje: 'Pje.',
  pasaje: 'Pje.',
}

// Títulos que la lista intercala como parte suelta ("Sarmiento, Pte., Av."). No
// aportan al geocoder y confunden la búsqueda, así que se descartan.
const HONORIFICOS = new Set([
  'dr', 'dra', 'pte', 'brig', 'gral', 'grl', 'tte', 'cnel', 'crl', 'cap', 'sgto',
  'ing', 'arq', 'pbro', 'mons', 'alte', 'vicealte', 'comod', 'prof', 'lic', 'may',
])

function limpiarToken(s: string): string {
  return s.replace(/\./g, '').trim().toLowerCase()
}

// "C.A.B.A.", "S.A.": siglas con puntos que no hay que pasar a Título.
const SIGLA = /^(?:[a-záéíóúñ]\.){2,}$/

function tituloSiEsMayusculas(s: string): string {
  // Hoja1 del padrón viene toda en mayúsculas ("LARREA 84"). Se normaliza para
  // que la app no grite, pero solo si no hay ninguna minúscula (si el archivo ya
  // viene bien escrito no se toca).
  if (/[a-záéíóúñ]/.test(s)) return s

  return s
    .toLowerCase()
    .split(/(\s+)/)
    .map((token) =>
      SIGLA.test(token)
        ? token.toUpperCase()
        : token.replace(/(^|[(/-])([a-záéíóúñ])/g, (_m, sep: string, letra: string) => sep + letra.toUpperCase())
    )
    .join('')
}

export interface DomicilioParseado {
  calle: string
  altura: number | null
}

/**
 * Extrae calle y altura de un domicilio del padrón.
 * "Espora Tomás, Av. - Ruta Provincial 210 596 (esq Mitre)" -> { calle: "Av. Espora Tomás", altura: 596 }
 */
export function parseDomicilio(raw: string): DomicilioParseado {
  let s = tituloSiEsMayusculas(String(raw ?? '').trim())
  if (!s) return { calle: '', altura: null }

  // "(esq Perú)", "(y/ó 5279)", "(ex Provincias Unidas)": aclaraciones, no dirección.
  // Se repite porque hay paréntesis anidados ("(entre Uriburu (Norte) y Moreno (Norte))"),
  // y al final se limpia cualquier paréntesis suelto que haya quedado sin par.
  let previo: string
  do {
    previo = s
    s = s.replace(/\([^()]*\)/g, ' ')
  } while (s !== previo)
  s = s.replace(/[()]/g, ' ').replace(/\bs\/n\b/gi, ' ').replace(/\s+/g, ' ').trim()

  // La altura es el número final. Se extrae antes de partir por " - " porque en
  // "Bosch J. M. - Calle 559 5957" la altura queda del lado del nombre alternativo.
  let altura: number | null = null
  const conAltura = s.match(/^(.*?[A-Za-zÁÉÍÓÚÑáéíóúñ].*?)\s+(\d{1,6})\s*$/)
  if (conAltura) {
    altura = Number(conAltura[2])
    s = conAltura[1].trim()
  } else {
    // "Calle 262 2655 Don Bosco": la altura quedó en el medio porque la lista le
    // agregó el barrio al final. Se busca el último número seguido de más texto.
    const alturaInterna = s.match(/^(.*?[A-Za-zÁÉÍÓÚÑáéíóúñ].*?)\s+(\d{1,6})\s+\D+$/)
    if (alturaInterna) {
      altura = Number(alturaInterna[2])
      s = alturaInterna[1].trim()
    }
  }

  // "Bosch J. M. - Calle 559": la calle tiene nombre alternativo, se usa el primero.
  s = s.split(/\s+[-–]\s+/)[0].trim()

  // "Sarmiento, Pte., Av." -> nombre + tipo de vía + títulos a descartar.
  const partes = s.split(',').map((p) => p.trim()).filter(Boolean)
  const nombre = partes[0] ?? ''
  let tipo = ''
  for (const parte of partes.slice(1)) {
    const t = TIPOS_VIA[limpiarToken(parte)]
    if (t) tipo = t
  }
  // Los títulos ya quedaron fuera al quedarnos solo con partes[0] y el tipo de vía,
  // pero puede venir pegado al nombre ("Sarmiento Pte."): se recorta del final.
  const tokens = nombre.split(/\s+/).filter((t) => !HONORIFICOS.has(limpiarToken(t)))

  const calle = [tipo, tokens.join(' ')].filter(Boolean).join(' ').trim()
  return { calle: calle || nombre, altura }
}

function esCABA(...valores: string[]): boolean {
  return valores.some((v) => /c\.?\s*a\.?\s*b\.?\s*a|capital\s*federal|ciudad\s*(aut[oó]noma\s*)?de\s*buenos\s*aires/i.test(v))
}

/** Consulta en texto libre para el geocoder, con el contexto geográfico correcto. */
export function armarGeoQuery(d: { calle: string; altura: number | null; barrio: string; localidad: string; partido: string }): string {
  const calle = [d.calle, d.altura ?? ''].filter(Boolean).join(' ').trim()
  if (!calle) return ''

  const contexto: string[] = []
  if (esCABA(d.partido, d.localidad)) {
    if (d.barrio) contexto.push(d.barrio)
    contexto.push('Ciudad Autónoma de Buenos Aires')
  } else {
    if (d.localidad) contexto.push(d.localidad)
    if (d.partido && d.partido !== d.localidad) contexto.push(d.partido)
  }
  contexto.push('Argentina')

  return [calle, ...contexto].join(', ')
}

/**
 * Clave de deduplicación. Se usa calle + altura + zona porque la misma dirección
 * aparece escrita de varias formas ("Emilio Mitre 108" y "Emilio Mitre 108 (esq X)")
 * y si no se unifican el vendedor termina con la misma puerta dos veces en el
 * recorrido. Sin altura no se puede unificar (dos esquinas distintas de la misma
 * calle son direcciones distintas), así que ahí se cae al texto original.
 */
export function armarClave(
  direccion: string,
  zona: string,
  calle?: string,
  altura?: number | null
): string {
  const base = calle && altura != null ? `${calle} ${altura}` : direccion
  return `${base.trim().toLowerCase()}|${zona.trim().toLowerCase()}`.replace(/\s+/g, ' ')
}

/**
 * El padrón escribe las calles con el apellido primero ("Castro Emilio, Gob., Av."
 * por Av. Gobernador Emilio Castro), y así OpenStreetMap no las encuentra. Devuelve
 * la calle con el primer término movido al final, o '' si no aplica.
 */
export function invertirNombreCalle(calle: string): string {
  const conTipo = calle.match(/^((?:Av\.|Diag\.|Bv\.|Pje\.)\s+)?(.+)$/)
  if (!conTipo) return ''

  const tipo = conTipo[1] ?? ''
  const nombre = conTipo[2].trim()

  // "Calle 18", "Ruta Nacional 3": invertirlas no da nada útil.
  if (/\d/.test(nombre)) return ''

  const palabras = nombre.split(/\s+/)
  if (palabras.length < 2) return ''

  return `${tipo}${[...palabras.slice(1), palabras[0]].join(' ')}`.trim()
}

/**
 * Consulta de reserva para cuando el geocoder no encuentra la dirección: se saca
 * el nivel más específico (barrio o localidad) y se deja el que igual mantiene la
 * ubicación acotada. Devuelve '' si no hay una alternativa segura: es preferible
 * marcar la dirección como fallida a ubicarla en otro punto del país.
 */
export function armarGeoQueryAlternativa(d: {
  calle: string
  altura: number | null
  barrio: string
  localidad: string
  partido: string
}): string {
  const calle = [d.calle, d.altura ?? ''].filter(Boolean).join(' ').trim()
  if (!calle) return ''

  if (esCABA(d.partido, d.localidad) && d.barrio) {
    return `${calle}, Ciudad Autónoma de Buenos Aires, Argentina`
  }
  if (d.partido && d.localidad && d.partido !== d.localidad) {
    return `${calle}, ${d.partido}, Buenos Aires, Argentina`
  }
  return ''
}

/** Encabezados posibles de cada columna, en minúsculas y sin acentos. */
const COLUMNAS = {
  direccion: ['domicilio', 'direccion', 'direccion/ cliente', 'direccion/cliente', 'calle', 'domicilio/cliente'],
  barrio: ['barrio'],
  localidad: ['localidad', 'ciudad'],
  partido: ['partido', 'municipio'],
}

const MARCAS_DIACRITICAS = new RegExp('[\\u0300-\\u036f]', 'g')

function sinAcentos(s: string): string {
  return s.normalize('NFD').replace(MARCAS_DIACRITICAS, '').trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * Ubica las columnas de una hoja buscando la fila de encabezados. Las hojas del
 * padrón no arrancan siempre en la fila 1 (Hoja1 tiene una fila vacía arriba).
 */
export function detectarColumnas(filas: unknown[][]): { fila: number; cols: Record<keyof typeof COLUMNAS, number> } | null {
  const limite = Math.min(filas.length, 15)
  for (let i = 0; i < limite; i++) {
    const celdas = (filas[i] ?? []).map((c) => sinAcentos(String(c ?? '')))
    const cols = {
      direccion: celdas.findIndex((c) => COLUMNAS.direccion.includes(c)),
      barrio: celdas.findIndex((c) => COLUMNAS.barrio.includes(c)),
      localidad: celdas.findIndex((c) => COLUMNAS.localidad.includes(c)),
      partido: celdas.findIndex((c) => COLUMNAS.partido.includes(c)),
    }
    if (cols.direccion !== -1 && (cols.localidad !== -1 || cols.barrio !== -1 || cols.partido !== -1)) {
      return { fila: i, cols }
    }
  }
  return null
}

/** Convierte las filas crudas de una hoja en direcciones listas para guardar. */
export function parseHoja(filas: unknown[][]): DireccionNueva[] {
  const encabezado = detectarColumnas(filas)
  if (!encabezado) return []

  const { fila, cols } = encabezado
  const leer = (f: unknown[], i: number) => (i === -1 ? '' : String(f[i] ?? '').trim())

  const salida: DireccionNueva[] = []
  for (const f of filas.slice(fila + 1)) {
    const direccionRaw = leer(f, cols.direccion)
    if (!direccionRaw) continue

    const direccion = tituloSiEsMayusculas(direccionRaw)
    const barrio = tituloSiEsMayusculas(leer(f, cols.barrio))
    const localidad = tituloSiEsMayusculas(leer(f, cols.localidad))
    const partido = tituloSiEsMayusculas(leer(f, cols.partido))

    // En CABA la lista trae el barrio y la localidad dice "C.A.B.A.": el barrio es
    // la zona útil para caminar. En GBA la zona es la localidad.
    const zona = barrio || localidad || partido
    if (!zona) continue

    const { calle, altura } = parseDomicilio(direccionRaw)
    salida.push({
      direccion,
      calle,
      altura,
      barrio,
      localidad,
      partido,
      zona,
      geo_query: armarGeoQuery({ calle, altura, barrio, localidad, partido }),
      clave: armarClave(direccion, zona, calle, altura),
    })
  }
  return salida
}

// ---------------------------------------------------------------------------
// Consultas
// ---------------------------------------------------------------------------

export interface ZonaResumen {
  zona: string
  partido: string
  total: number
  geocodificadas: number
  fallidas: number
}

/** Resumen del padrón agrupado por zona, para los selectores y el panel de admin. */
export async function getZonasPadron(): Promise<ZonaResumen[]> {
  const supabase = getSupabaseAdmin()
  const porZona = new Map<string, ZonaResumen>()

  // Supabase pagina de a 1000: el padrón puede tener miles de filas, así que se
  // recorre en tandas hasta agotarlo.
  const TANDA = 1000
  for (let desde = 0; ; desde += TANDA) {
    const { data, error } = await supabase
      .from('direcciones')
      .select('zona, partido, geo_estado')
      .order('zona')
      .range(desde, desde + TANDA - 1)

    if (error || !data || data.length === 0) break

    for (const fila of data as { zona: string; partido: string; geo_estado: GeoEstado }[]) {
      const actual = porZona.get(fila.zona) ?? {
        zona: fila.zona,
        partido: fila.partido ?? '',
        total: 0,
        geocodificadas: 0,
        fallidas: 0,
      }
      actual.total++
      if (fila.geo_estado === 'ok') actual.geocodificadas++
      if (fila.geo_estado === 'fallo') actual.fallidas++
      porZona.set(fila.zona, actual)
    }

    if (data.length < TANDA) break
  }

  return [...porZona.values()].sort((a, b) => b.total - a.total || a.zona.localeCompare(b.zona))
}

export async function getDireccionesDeZonas(zonas: string[], limite = 500): Promise<Direccion[]> {
  if (zonas.length === 0) return []
  const { data } = await getSupabaseAdmin()
    .from('direcciones')
    .select('*')
    .in('zona', zonas)
    .order('calle')
    .order('altura')
    .limit(limite)
  return (data ?? []) as Direccion[]
}

export async function getPendientesDeGeocodificar(zonas: string[], limite: number): Promise<Direccion[]> {
  let query = getSupabaseAdmin()
    .from('direcciones')
    .select('*')
    .eq('geo_estado', 'pendiente')
    .neq('geo_query', '')
    .limit(limite)

  if (zonas.length > 0) query = query.in('zona', zonas)

  const { data } = await query
  return (data ?? []) as Direccion[]
}

export async function contarPendientes(zonas: string[]): Promise<number> {
  let query = getSupabaseAdmin()
    .from('direcciones')
    .select('*', { count: 'exact', head: true })
    .eq('geo_estado', 'pendiente')
    .neq('geo_query', '')

  if (zonas.length > 0) query = query.in('zona', zonas)

  const { count } = await query
  return count ?? 0
}

export async function contarPadron(): Promise<{ total: number; ok: number; pendientes: number; fallidas: number }> {
  const supabase = getSupabaseAdmin()
  const contar = async (estado?: GeoEstado) => {
    let q = supabase.from('direcciones').select('*', { count: 'exact', head: true })
    if (estado) q = q.eq('geo_estado', estado)
    const { count } = await q
    return count ?? 0
  }
  const [total, ok, pendientes, fallidas] = await Promise.all([
    contar(), contar('ok'), contar('pendiente'), contar('fallo'),
  ])
  return { total, ok, pendientes, fallidas }
}
