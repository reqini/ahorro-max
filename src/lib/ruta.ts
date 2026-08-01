// Armado del orden de caminata de un recorrido.
//
// Ordenar paradas para recorrerlas a pie es un TSP: no tiene solución exacta
// rápida, pero con vecino más cercano + 2-opt se llega a un recorrido muy cercano
// al óptimo en milisegundos para las decenas de paradas que hace un vendedor.

export interface Punto {
  lat: number | null
  lng: number | null
}

const RADIO_TIERRA_M = 6371000

/** Distancia en línea recta entre dos coordenadas, en metros. */
export function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const rad = Math.PI / 180
  const dLat = (b.lat - a.lat) * rad
  const dLng = (b.lng - a.lng) * rad
  const lat1 = a.lat * rad
  const lat2 = b.lat * rad

  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * RADIO_TIERRA_M * Math.asin(Math.min(1, Math.sqrt(h)))
}

type ConCoords<T> = T & { lat: number; lng: number }

function tieneCoords<T extends Punto>(p: T): p is ConCoords<T> {
  return typeof p.lat === 'number' && typeof p.lng === 'number'
}

/** Arranca por el punto más al noroeste, para que el recorrido sea reproducible. */
function indiceInicial<T extends { lat: number; lng: number }>(puntos: T[]): number {
  let mejor = 0
  for (let i = 1; i < puntos.length; i++) {
    const p = puntos[i]
    const m = puntos[mejor]
    if (p.lat > m.lat || (p.lat === m.lat && p.lng < m.lng)) mejor = i
  }
  return mejor
}

function vecinoMasCercano<T extends { lat: number; lng: number }>(puntos: T[]): T[] {
  const pendientes = [...puntos]
  const ruta: T[] = [pendientes.splice(indiceInicial(pendientes), 1)[0]]

  while (pendientes.length > 0) {
    const actual = ruta[ruta.length - 1]
    let mejor = 0
    let mejorDist = Infinity
    for (let i = 0; i < pendientes.length; i++) {
      const d = haversine(actual, pendientes[i])
      if (d < mejorDist) {
        mejorDist = d
        mejor = i
      }
    }
    ruta.push(pendientes.splice(mejor, 1)[0])
  }

  return ruta
}

/**
 * 2-opt: mientras encuentre dos tramos que se cruzan, los desarma y los vuelve a
 * unir al revés. Es lo que saca las idas y vueltas que deja el vecino más cercano.
 */
function dosOpt<T extends { lat: number; lng: number }>(ruta: T[], maxPasadas = 30): T[] {
  const r = [...ruta]
  const n = r.length
  if (n < 4) return r

  for (let pasada = 0; pasada < maxPasadas; pasada++) {
    let mejoro = false

    for (let i = 0; i < n - 2; i++) {
      for (let k = i + 2; k < n; k++) {
        const actual = haversine(r[i], r[i + 1]) + (k + 1 < n ? haversine(r[k], r[k + 1]) : 0)
        const nuevo = haversine(r[i], r[k]) + (k + 1 < n ? haversine(r[i + 1], r[k + 1]) : 0)

        if (nuevo < actual - 0.5) {
          // Invertir el tramo i+1..k elimina el cruce.
          const tramo = r.slice(i + 1, k + 1).reverse()
          r.splice(i + 1, tramo.length, ...tramo)
          mejoro = true
        }
      }
    }

    if (!mejoro) break
  }

  return r
}

function numeroDeAltura(direccion: string): number {
  const m = direccion.match(/(\d{1,6})\s*$/)
  return m ? Number(m[1]) : 0
}

/**
 * Orden de reserva para las direcciones sin coordenadas: calle por calle, cada
 * calle ordenada por altura y alternando el sentido (serpentina), que es como se
 * camina una zona en la práctica.
 */
export function ordenarPorCalle<T extends { calle?: string; direccion: string }>(items: T[]): T[] {
  const porCalle = new Map<string, T[]>()
  for (const item of items) {
    const calle = (item.calle || item.direccion).trim().toLowerCase()
    const lista = porCalle.get(calle) ?? []
    lista.push(item)
    porCalle.set(calle, lista)
  }

  const calles = [...porCalle.keys()].sort()
  const salida: T[] = []
  calles.forEach((calle, i) => {
    const lista = porCalle.get(calle)!.sort((a, b) => numeroDeAltura(a.direccion) - numeroDeAltura(b.direccion))
    salida.push(...(i % 2 === 1 ? lista.reverse() : lista))
  })

  return salida
}

export interface RutaArmada<T> {
  paradas: T[]
  /** Metros caminados desde la parada anterior; el primer elemento es 0. */
  tramos: number[]
  distanciaTotal: number
  minutos: number
}

const VELOCIDAD_CAMINANDO_M_MIN = 75 // ~4,5 km/h
const MINUTOS_POR_PARADA = 4

/**
 * Ordena las paradas para caminarlas. Las que tienen coordenadas se optimizan por
 * distancia real; las que no pudieron geocodificarse quedan al final ordenadas por
 * calle y altura, para no perderlas del recorrido.
 */
export function armarRuta<T extends Punto & { calle?: string; direccion: string }>(items: T[]): RutaArmada<T> {
  const conCoords = items.filter(tieneCoords)
  const sinCoords = items.filter((i) => !tieneCoords(i))

  const optimizadas = conCoords.length > 1 ? dosOpt(vecinoMasCercano(conCoords)) : conCoords
  const paradas = [...optimizadas, ...ordenarPorCalle(sinCoords)] as T[]

  const tramos: number[] = []
  let distanciaTotal = 0
  paradas.forEach((parada, i) => {
    const anterior = paradas[i - 1]
    if (i === 0 || !anterior || !tieneCoords(parada) || !tieneCoords(anterior)) {
      tramos.push(0)
      return
    }
    const d = Math.round(haversine(anterior, parada))
    tramos.push(d)
    distanciaTotal += d
  })

  const minutos = Math.round(distanciaTotal / VELOCIDAD_CAMINANDO_M_MIN + paradas.length * MINUTOS_POR_PARADA)
  return { paradas, tramos, distanciaTotal, minutos }
}

export function formatearDistancia(metros: number): string {
  if (metros < 1000) return `${metros} m`
  return `${(metros / 1000).toFixed(1).replace('.', ',')} km`
}

export function formatearDuracion(minutos: number): string {
  if (minutos < 60) return `${minutos} min`
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}
