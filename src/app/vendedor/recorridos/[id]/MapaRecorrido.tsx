'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import type { LayerGroup, Map as LeafletMap } from 'leaflet'
import type { EstadoParada } from '@/lib/recorridos'
import type { Ubicacion } from './useUbicacion'

export interface PuntoMapa {
  orden: number
  lat: number
  lng: number
  direccion: string
  estado: EstadoParada
}

const COLORES: Record<EstadoParada, string> = {
  pendiente: '#CC0000',
  visitada: '#22c55e',
  no_atendio: '#F5C000',
  cerrado: '#6b7280',
}

interface Props {
  puntos: PuntoMapa[]
  ubicacion: Ubicacion | null
  /** Orden de la próxima parada pendiente: se destaca y se le traza la línea guía. */
  proximaOrden: number | null
  seguir: boolean
  /** Pedido puntual de centrar el mapa en una parada (cambia el `token` en cada pedido). */
  enfoque: { lat: number; lng: number; token: number } | null
  /** Se avisa cuando el vendedor mueve el mapa a mano, para soltar el auto-centrado. */
  onArrastrar?: () => void
}

export function MapaRecorrido({ puntos, ubicacion, proximaOrden, seguir, enfoque, onArrastrar }: Props) {
  const nodo = useRef<HTMLDivElement>(null)
  const mapa = useRef<LeafletMap | null>(null)
  const L = useRef<typeof import('leaflet') | null>(null)
  const capaRuta = useRef<LayerGroup | null>(null)
  const capaUbicacion = useRef<LayerGroup | null>(null)
  const encuadrado = useRef(false)
  const onArrastrarRef = useRef(onArrastrar)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    onArrastrarRef.current = onArrastrar
  }, [onArrastrar])

  // 1) El mapa se crea una sola vez. Las capas se actualizan aparte para que seguir
  //    la posición en vivo no obligue a redibujar toda la ruta.
  useEffect(() => {
    let cancelado = false

    void (async () => {
      const mod = await import('leaflet')
      if (cancelado || !nodo.current || mapa.current) return

      const Lm = mod.default
      L.current = Lm

      const m = Lm.map(nodo.current, { zoomControl: false, attributionControl: false })
      m.setView([-34.62, -58.5], 12)
      Lm.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      }).addTo(m)
      Lm.control.zoom({ position: 'topright' }).addTo(m)

      capaRuta.current = Lm.layerGroup().addTo(m)
      capaUbicacion.current = Lm.layerGroup().addTo(m)
      m.on('dragstart', () => onArrastrarRef.current?.())

      mapa.current = m
      // El contenedor arranca con alto 0 dentro del layout fijo: sin esto el mapa
      // se dibuja recortado hasta el primer resize.
      setTimeout(() => m.invalidateSize(), 60)
      setListo(true)
    })()

    return () => {
      cancelado = true
      mapa.current?.remove()
      mapa.current = null
      setListo(false)
      encuadrado.current = false
    }
  }, [])

  // 2) Paradas y trazado del recorrido.
  useEffect(() => {
    const Lm = L.current
    const capa = capaRuta.current
    const m = mapa.current
    if (!listo || !Lm || !capa || !m) return

    capa.clearLayers()
    if (puntos.length === 0) return

    const latlngs = puntos.map((p) => [p.lat, p.lng] as [number, number])
    Lm.polyline(latlngs, { color: '#CC0000', weight: 3, opacity: 0.55 }).addTo(capa)

    for (const p of puntos) {
      const esProxima = p.orden === proximaOrden
      const tamano = esProxima ? 34 : 26
      // divIcon numerado: evita depender de los PNG de Leaflet (que se rompen al
      // pasar por el bundler) y muestra el orden de la caminata.
      const icono = Lm.divIcon({
        className: '',
        iconSize: [tamano, tamano],
        iconAnchor: [tamano / 2, tamano / 2],
        html: `<div style="width:${tamano}px;height:${tamano}px;border-radius:50%;background:${COLORES[p.estado]};color:#fff;font:700 ${esProxima ? 14 : 12}px/${tamano}px system-ui,sans-serif;text-align:center;border:${esProxima ? 3 : 2}px solid ${esProxima ? '#fff' : '#0a0a0a'};box-shadow:0 2px 6px rgba(0,0,0,.7)">${p.orden + 1}</div>`,
      })
      Lm.marker([p.lat, p.lng], { icon: icono, zIndexOffset: esProxima ? 500 : 0 })
        .addTo(capa)
        .bindPopup(`<b>${p.orden + 1}.</b> ${p.direccion}`)
    }

    if (!encuadrado.current) {
      m.fitBounds(Lm.latLngBounds(latlngs), { padding: [40, 40], maxZoom: 17 })
      encuadrado.current = true
    }
  }, [listo, puntos, proximaOrden])

  // 3) Dónde está el vendedor + hacia dónde sigue.
  useEffect(() => {
    const Lm = L.current
    const capa = capaUbicacion.current
    if (!listo || !Lm || !capa) return

    capa.clearLayers()
    if (!ubicacion) return

    const aqui: [number, number] = [ubicacion.lat, ubicacion.lng]

    // Círculo de precisión: el GPS del celular rara vez baja de 10-20 m.
    Lm.circle(aqui, {
      radius: Math.max(ubicacion.precision, 8),
      color: '#3b82f6',
      weight: 1,
      fillColor: '#3b82f6',
      fillOpacity: 0.15,
    }).addTo(capa)

    const proxima = puntos.find((p) => p.orden === proximaOrden)
    if (proxima) {
      Lm.polyline([aqui, [proxima.lat, proxima.lng]], {
        color: '#3b82f6',
        weight: 3,
        opacity: 0.8,
        dashArray: '7 7',
      }).addTo(capa)
    }

    // El vendedor se dibuja como una figura caminando, para que se distinga de un
    // vistazo de los círculos numerados de las paradas.
    Lm.marker(aqui, {
      zIndexOffset: 1000,
      icon: Lm.divIcon({
        className: '',
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        html:
          '<div style="position:relative;width:38px;height:38px">' +
          '<div style="position:absolute;inset:0;border-radius:50%;background:#3b82f6;opacity:.25;animation:pulsoVendedor 2s ease-out infinite"></div>' +
          '<div style="position:absolute;left:5px;top:5px;width:28px;height:28px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.7);font:16px/22px system-ui;text-align:center">🚶</div>' +
          '</div>',
      }),
    })
      .addTo(capa)
      .bindPopup('Estás acá')
  }, [listo, ubicacion, proximaOrden, puntos])

  // 4) Auto-centrado mientras camina.
  useEffect(() => {
    if (!listo || !seguir || !ubicacion || !mapa.current) return
    mapa.current.setView([ubicacion.lat, ubicacion.lng], Math.max(mapa.current.getZoom(), 16), {
      animate: true,
    })
  }, [listo, seguir, ubicacion])

  // 5) Centrar en una parada elegida desde la lista.
  useEffect(() => {
    if (!listo || !enfoque || !mapa.current) return
    mapa.current.setView([enfoque.lat, enfoque.lng], Math.max(mapa.current.getZoom(), 17), {
      animate: true,
    })
  }, [listo, enfoque])

  return <div ref={nodo} className="absolute inset-0 bg-[#111]" />
}
