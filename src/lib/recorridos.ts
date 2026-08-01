import { getSupabaseAdmin } from './supabase'
import { getDireccionesDeZonas, mensajeDeError } from './direcciones'
import { armarRuta } from './ruta'

export type EstadoRecorrido = 'activo' | 'completado'
export type EstadoParada = 'pendiente' | 'visitada' | 'no_atendio' | 'cerrado'

export const ESTADOS_PARADA: { valor: EstadoParada; label: string; corto: string }[] = [
  { valor: 'pendiente', label: 'Pendiente', corto: '—' },
  { valor: 'visitada', label: 'Visitada', corto: '✓' },
  { valor: 'no_atendio', label: 'No atendió', corto: '✕' },
  { valor: 'cerrado', label: 'Cerrado', corto: '⌂' },
]

export interface Recorrido {
  id: string
  nombre: string
  vendedor: string
  zonas: string[]
  estado: EstadoRecorrido
  distancia_m: number
  minutos: number
  /** Día de la agenda en formato YYYY-MM-DD. */
  fecha: string | null
  /** Usuario del admin que lo asignó; vacío si lo armó el propio vendedor. */
  asignado_por: string
  created_at: string
  updated_at: string
}

// ---------------------------------------------------------------------------
// Agenda semanal
// ---------------------------------------------------------------------------

export const DIAS_LABORALES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']

/** Fecha en YYYY-MM-DD según la hora local, sin corrimientos por zona horaria. */
export function aFechaISO(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${fecha.getFullYear()}-${mes}-${dia}`
}

/** Los cinco días hábiles de la semana que contiene a `referencia`. */
export function semanaLaboral(referencia = new Date()): string[] {
  const lunes = new Date(referencia)
  // getDay(): 0 es domingo. Se corre al lunes de esa misma semana.
  const corrimiento = (lunes.getDay() + 6) % 7
  lunes.setDate(lunes.getDate() - corrimiento)

  return DIAS_LABORALES.map((_, i) => {
    const dia = new Date(lunes)
    dia.setDate(lunes.getDate() + i)
    return aFechaISO(dia)
  })
}

export function sumarSemanas(fechaISO: string, semanas: number): string {
  const [a, m, d] = fechaISO.split('-').map(Number)
  const fecha = new Date(a, m - 1, d)
  fecha.setDate(fecha.getDate() + semanas * 7)
  return aFechaISO(fecha)
}

export function etiquetaDia(fechaISO: string): string {
  const [a, m, d] = fechaISO.split('-').map(Number)
  return new Date(a, m - 1, d).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

export interface Parada {
  id: string
  recorrido_id: string
  direccion_id: string | null
  orden: number
  direccion: string
  zona: string
  lat: number | null
  lng: number | null
  metros_desde_anterior: number
  estado: EstadoParada
  nota: string
  visitada_at: string | null
}

export async function getRecorridos(vendedor: string): Promise<Recorrido[]> {
  const { data } = await getSupabaseAdmin()
    .from('recorridos')
    .select('*')
    .eq('vendedor', vendedor)
    .order('created_at', { ascending: false })
  return (data ?? []) as Recorrido[]
}

/** Recorridos de un vendedor en un rango de días (agenda semanal). */
export async function getRecorridosEntre(
  vendedor: string,
  desde: string,
  hasta: string
): Promise<Recorrido[]> {
  const { data } = await getSupabaseAdmin()
    .from('recorridos')
    .select('*')
    .eq('vendedor', vendedor)
    .gte('fecha', desde)
    .lte('fecha', hasta)
    .order('fecha')
  return (data ?? []) as Recorrido[]
}

/** Igual que el anterior pero de todos los vendedores: es la vista del admin. */
export async function getAgendaSemana(desde: string, hasta: string): Promise<Recorrido[]> {
  const { data } = await getSupabaseAdmin()
    .from('recorridos')
    .select('*')
    .gte('fecha', desde)
    .lte('fecha', hasta)
    .order('fecha')
  return (data ?? []) as Recorrido[]
}

export async function getRecorrido(id: string, vendedor: string): Promise<Recorrido | null> {
  const { data } = await getSupabaseAdmin()
    .from('recorridos')
    .select('*')
    .eq('id', id)
    .eq('vendedor', vendedor)
    .single()
  return (data ?? null) as Recorrido | null
}

export async function getParadas(recorridoId: string): Promise<Parada[]> {
  const { data } = await getSupabaseAdmin()
    .from('recorrido_paradas')
    .select('*')
    .eq('recorrido_id', recorridoId)
    .order('orden')
  return (data ?? []) as Parada[]
}

/** Cuántas paradas de cada estado tiene cada recorrido, para el listado. */
export async function getAvances(recorridoIds: string[]): Promise<Map<string, { total: number; hechas: number }>> {
  const avances = new Map<string, { total: number; hechas: number }>()
  if (recorridoIds.length === 0) return avances

  const { data } = await getSupabaseAdmin()
    .from('recorrido_paradas')
    .select('recorrido_id, estado')
    .in('recorrido_id', recorridoIds)

  for (const fila of (data ?? []) as { recorrido_id: string; estado: EstadoParada }[]) {
    const actual = avances.get(fila.recorrido_id) ?? { total: 0, hechas: 0 }
    actual.total++
    if (fila.estado !== 'pendiente') actual.hechas++
    avances.set(fila.recorrido_id, actual)
  }

  return avances
}

export interface CrearRecorridoInput {
  vendedor: string
  nombre: string
  zonas: string[]
  maxParadas: number
  /** Si es true, deja afuera las direcciones que no se pudieron geocodificar. */
  soloGeocodificadas: boolean
  /** Día de la agenda (YYYY-MM-DD). Por defecto, hoy. */
  fecha?: string
  /** Admin que lo asigna; vacío si lo arma el propio vendedor. */
  asignadoPor?: string
}

export type CrearRecorridoResult = { id: string; paradas: number } | { error: string }

/**
 * Toma las direcciones de las zonas elegidas, las ordena como caminata y guarda
 * el recorrido con sus paradas.
 */
export async function crearRecorrido(input: CrearRecorridoInput): Promise<CrearRecorridoResult> {
  const { vendedor, zonas, maxParadas, soloGeocodificadas } = input
  if (zonas.length === 0) return { error: 'Elegí al menos una zona' }

  const direcciones = await getDireccionesDeZonas(zonas)
  const candidatas = soloGeocodificadas ? direcciones.filter((d) => d.geo_estado === 'ok') : direcciones

  if (candidatas.length === 0) {
    return {
      error: soloGeocodificadas
        ? 'Esas zonas todavía no tienen direcciones geocodificadas. Pedile al admin que las procese.'
        : 'No hay direcciones cargadas en esas zonas',
    }
  }

  const { paradas, tramos, distanciaTotal, minutos } = armarRuta(candidatas)
  const recortadas = paradas.slice(0, maxParadas)

  // Recortar cambia el largo del recorrido: se recalcula sobre lo que queda.
  const tramosRecortados = tramos.slice(0, recortadas.length)
  const distancia = recortadas.length === paradas.length
    ? distanciaTotal
    : tramosRecortados.reduce((a, b) => a + b, 0)
  const duracion = recortadas.length === paradas.length
    ? minutos
    : Math.round(distancia / 75 + recortadas.length * 4)

  const supabase = getSupabaseAdmin()
  const { data: recorrido, error } = await supabase
    .from('recorridos')
    .insert({
      nombre: input.nombre || zonas.join(', '),
      vendedor,
      zonas,
      estado: 'activo',
      distancia_m: distancia,
      minutos: duracion,
      fecha: input.fecha ?? aFechaISO(new Date()),
      asignado_por: input.asignadoPor ?? '',
    })
    .select('id')
    .single()

  if (error || !recorrido) {
    return { error: error ? mensajeDeError(error.message) : 'No se pudo crear el recorrido' }
  }

  const filas = recortadas.map((d, i) => ({
    recorrido_id: recorrido.id as string,
    direccion_id: d.id,
    orden: i,
    // El texto crudo del padrón es ilegible caminando ("Perón, Pte., Av. (ex Gaona,
    // Av.) 1199 (esq Pueyrredón)"). Se guarda la calle normalizada, que es la que
    // el vendedor necesita leer de un vistazo; el original queda en `direcciones`.
    direccion: d.calle && d.altura != null ? `${d.calle} ${d.altura}` : d.direccion,
    zona: d.zona,
    lat: d.lat,
    lng: d.lng,
    metros_desde_anterior: tramosRecortados[i] ?? 0,
    estado: 'pendiente',
  }))

  const { error: errorParadas } = await supabase.from('recorrido_paradas').insert(filas)
  if (errorParadas) {
    await supabase.from('recorridos').delete().eq('id', recorrido.id)
    return { error: errorParadas.message }
  }

  return { id: recorrido.id as string, paradas: filas.length }
}
