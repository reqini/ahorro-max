'use client'

import dynamic from 'next/dynamic'

const MapaZonaInner = dynamic(() => import('./MapaZonaInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#111] flex items-center justify-center">
      <span className="text-white/30 text-sm">Cargando mapa...</span>
    </div>
  ),
})

export function MapaZona() {
  return <MapaZonaInner />
}
