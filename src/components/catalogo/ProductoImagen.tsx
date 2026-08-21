'use client'

import { useState } from 'react'

/**
 * Color de cada marca, para que el respaldo sin foto se lea de un vistazo: la
 * góndola se reconoce por el color antes que por el texto.
 */
const COLORES_MARCA: Record<string, string> = {
  'coca-cola': '#E4002B',
  sprite: '#00A651',
  pepsi: '#0055A5',
  'seven up': '#2AA84A',
  'paso de los toros': '#D4A017',
  speed: '#D40000',
  'red bull': '#00368C',
  'eco de los andes': '#0093D0',
  glaciar: '#0086C3',
  villavicencio: '#0071CE',
  'sierra de los padres': '#1BA3D6',
  cepita: '#F07300',
  quilmes: '#007A33',
  schneider: '#C8102E',
  amstel: '#C8102E',
  isenbeck: '#0F4C81',
  grolsch: '#007A33',
  budweiser: '#C8102E',
  michelob: '#8A6C34',
  andes: '#8B1A1A',
  'stella artois': '#B01B2E',
  heineken: '#007A33',
  warsteiner: '#B8860B',
  corona: '#C79100',
  sol: '#C08A00',
  branca: '#00703C',
  aperol: '#E4571B',
  campari: '#C8102E',
  cynar: '#00693E',
  'jägermeister': '#00693E',
  gancia: '#C79100',
}

const COLORES = ['#CC0000', '#B8860B', '#2563eb', '#16a34a', '#9333ea', '#ea580c', '#0891b2']

function colorPorNombre(nombre: string): string {
  const conocido = COLORES_MARCA[nombre.trim().toLowerCase()]
  if (conocido) return conocido

  let h = 0
  for (let i = 0; i < nombre.length; i++) h = (h * 31 + nombre.charCodeAt(i)) % COLORES.length
  return COLORES[h]
}

/**
 * Foto del producto sobre fondo claro, para que el packaging resalte. Si no hay
 * foto —o la URL no carga— se muestra la marca sobre la silueta del envase, en el
 * mismo fondo claro que usan las fotos: la grilla queda pareja y presentable
 * mientras se terminan de cargar las fotos reales.
 */
export function ProductoImagen({
  src,
  nombre,
  marca,
  className = '',
}: {
  src?: string
  nombre: string
  marca?: string
  className?: string
}) {
  const [falló, setFalló] = useState(false)
  const mostrarFoto = src && !falló

  if (mostrarFoto) {
    return (
      <div className={`bg-white flex items-center justify-center overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={nombre}
          loading="lazy"
          onError={() => setFalló(true)}
          className="w-full h-full object-contain p-2"
        />
      </div>
    )
  }

  const etiqueta = marca || nombre
  const color = colorPorNombre(etiqueta)
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-[#f2f2f2] ${className}`}
      aria-label={nombre}
    >
      <svg
        viewBox="0 0 64 96"
        className="absolute h-[80%] w-auto opacity-20"
        fill={color}
        stroke={color}
        strokeWidth="2"
        aria-hidden="true"
      >
        {/* Silueta genérica de botella: sugiere el producto sin fingir una foto. */}
        <path d="M26 4h12v14c0 4 10 10 10 20v50a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6V38c0-10 10-16 10-20V4Z" />
      </svg>
      <span
        className="relative px-2 text-center font-black uppercase leading-tight tracking-tight text-[11px] sm:text-xs"
        style={{ color }}
      >
        {etiqueta}
      </span>
    </div>
  )
}
