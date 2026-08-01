import { getSupabaseAdmin } from './supabase'
import {
  armarGeoQuery,
  armarGeoQueryAlternativa,
  contarPendientes,
  getDireccionesDeZonas,
  getPendientesDeGeocodificar,
  invertirNombreCalle,
} from './direcciones'
import { haversine } from './ruta'

// Geocodificación con Nominatim (OpenStreetMap). Es gratis y sin API key, pero su
// política de uso exige un User-Agent identificable y como máximo 1 consulta por
// segundo. Por eso se geocodifica de a tandas chicas y una sola vez por dirección:
// el resultado queda guardado en la tabla `direcciones`.

const NOMINATIM = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'AhorraMax-Recorridos/1.0 (https://ahorramax.com.ar)'
const ESPERA_MS = 1100

export interface Coordenada {
  lat: number
  lng: number
}

function esperar(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/**
 * Devuelve la coordenada de una dirección, o null si Nominatim no la encuentra.
 * Lanza si la API falla (429, 5xx): el llamador corta la tanda en vez de marcar
 * como fallidas direcciones que en realidad no se llegaron a consultar.
 */
export async function geocodificar(query: string): Promise<Coordenada | null> {
  const url = `${NOMINATIM}?format=jsonv2&limit=1&countrycodes=ar&q=${encodeURIComponent(query)}`

  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'es' },
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`Nominatim respondió ${res.status}`)

  const json = (await res.json()) as { lat?: string; lon?: string }[]
  const hit = Array.isArray(json) ? json[0] : null
  if (!hit?.lat || !hit?.lon) return null

  const lat = Number(hit.lat)
  const lng = Number(hit.lon)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

  return { lat, lng }
}

export interface ResultadoTanda {
  procesadas: number
  ok: number
  fallidas: number
  restantes: number
  error?: string
}

// Muchos nombres de zona se repiten en el país: "San Martín" es un partido del
// conurbano y también un barrio de Bahía Blanca, y Nominatim puede devolver el
// equivocado. Una parada a 600 km arruina el recorrido entero, así que se descarta
// todo resultado que caiga demasiado lejos del resto de su zona.
const MAX_DESVIO_M = 25000
const MIN_REFERENCIAS = 3

function centroAproximado(puntos: { lat: number; lng: number }[]): { lat: number; lng: number } {
  // Mediana en vez de promedio: un punto disparatado no corre el centro.
  const lats = puntos.map((p) => p.lat).sort((a, b) => a - b)
  const lngs = puntos.map((p) => p.lng).sort((a, b) => a - b)
  const medio = Math.floor(puntos.length / 2)
  return { lat: lats[medio], lng: lngs[medio] }
}

/** Coordenadas ya confirmadas de cada zona, para usarlas como referencia. */
async function referenciasPorZona(zonas: string[]): Promise<Map<string, { lat: number; lng: number }[]>> {
  const mapa = new Map<string, { lat: number; lng: number }[]>()
  if (zonas.length === 0) return mapa

  const existentes = await getDireccionesDeZonas(zonas, 2000)
  for (const d of existentes) {
    if (d.geo_estado !== 'ok' || d.lat == null || d.lng == null) continue
    const lista = mapa.get(d.zona) ?? []
    lista.push({ lat: d.lat, lng: d.lng })
    mapa.set(d.zona, lista)
  }
  return mapa
}

function esCoherenteConLaZona(coord: Coordenada, referencias: { lat: number; lng: number }[]): boolean {
  if (referencias.length < MIN_REFERENCIAS) return true
  return haversine(centroAproximado(referencias), coord) <= MAX_DESVIO_M
}

// Una dirección que falla gasta hasta 3 consultas (principal + invertida + acotada),
// o sea ~3,5 s. Con 20 por tanda el peor caso son 69 s y la función de Vercel corta
// a los 60: por eso la tanda se cierra sola antes de llegar al límite.
const PRESUPUESTO_MS = 40000

/**
 * Geocodifica hasta `limite` direcciones pendientes de las zonas indicadas, sin
 * pasarse del presupuesto de tiempo. El cliente llama en loop hasta que
 * `restantes` llega a 0.
 */
export async function geocodificarTanda(zonas: string[], limite = 20): Promise<ResultadoTanda> {
  const arranque = Date.now()
  const supabase = getSupabaseAdmin()
  const pendientes = await getPendientesDeGeocodificar(zonas, limite)

  let ok = 0
  let fallidas = 0
  let error: string | undefined

  // Las zonas de esta tanda, con lo que ya se sabe de cada una: sirve de referencia
  // para descartar resultados que caigan en otra punta del país.
  const referencias = await referenciasPorZona([...new Set(pendientes.map((d) => d.zona))])

  for (let i = 0; i < pendientes.length; i++) {
    const d = pendientes[i]
    // Cerrar la tanda a tiempo: lo que quede sigue pendiente y entra en la próxima.
    if (Date.now() - arranque > PRESUPUESTO_MS) break
    if (i > 0) await esperar(ESPERA_MS)

    try {
      let coord = await geocodificar(d.geo_query)

      // Segundo intento con el nombre de la calle dado vuelta: el padrón usa
      // "Castro Emilio" donde OSM tiene "Emilio Castro".
      if (!coord) {
        const invertida = invertirNombreCalle(d.calle)
        if (invertida) {
          const query = armarGeoQuery({ ...d, calle: invertida })
          if (query && query !== d.geo_query) {
            await esperar(ESPERA_MS)
            coord = await geocodificar(query)
          }
        }
      }

      // Tercer intento sacando el barrio o la localidad: muchas direcciones reales
      // no existen en OSM con ese nivel de detalle pero sí con el partido.
      if (!coord) {
        const alternativa = armarGeoQueryAlternativa(d)
        if (alternativa && alternativa !== d.geo_query) {
          await esperar(ESPERA_MS)
          coord = await geocodificar(alternativa)
        }
      }

      const refZona = referencias.get(d.zona) ?? []
      if (coord && !esCoherenteConLaZona(coord, refZona)) coord = null

      if (coord) {
        await supabase
          .from('direcciones')
          .update({ lat: coord.lat, lng: coord.lng, geo_estado: 'ok' })
          .eq('id', d.id)
        // Alimenta la referencia para las direcciones que siguen en la misma tanda.
        refZona.push(coord)
        referencias.set(d.zona, refZona)
        ok++
      } else {
        await supabase.from('direcciones').update({ geo_estado: 'fallo' }).eq('id', d.id)
        fallidas++
      }
    } catch (e) {
      // Falla de la API, no de la dirección: se corta acá y se reintenta después.
      error = e instanceof Error ? e.message : 'Error consultando Nominatim'
      break
    }
  }

  const restantes = await contarPendientes(zonas)
  return { procesadas: ok + fallidas, ok, fallidas, restantes, error }
}
