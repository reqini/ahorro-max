'use client'

import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet default icon in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

// Polígono aproximado del barrio Ciudadela (Tres de Febrero, GBA)
const CIUDADELA_POLYGON: [number, number][] = [
  [-34.6145, -58.5560],
  [-34.6145, -58.5830],
  [-34.6390, -58.5830],
  [-34.6390, -58.5560],
]

const CENTER: [number, number] = [-34.6268, -58.5695]

export default function MapaZonaInner() {
  return (
    <MapContainer
      center={CENTER}
      zoom={13}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polygon
        positions={CIUDADELA_POLYGON}
        pathOptions={{
          color: '#CC0000',
          fillColor: '#CC0000',
          fillOpacity: 0.18,
          weight: 2.5,
          opacity: 0.8,
        }}
      />
      <Marker position={CENTER} icon={icon}>
        <Popup>
          <strong>Distribuidora Ahorra Max</strong><br />
          Zona de cobertura: Ciudadela
        </Popup>
      </Marker>
    </MapContainer>
  )
}
