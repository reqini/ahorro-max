'use client'

import { useState } from 'react'

const COLORES = ['#CC0000', '#F5C000', '#2563eb', '#16a34a', '#9333ea', '#ea580c', '#0891b2']

function colorPorNombre(nombre: string): string {
  let h = 0
  for (let i = 0; i < nombre.length; i++) h = (h * 31 + nombre.charCodeAt(i)) % COLORES.length
  return COLORES[h]
}

/**
 * Foto del producto sobre fondo claro, para que el packaging resalte. Si no hay
 * imagen —o la URL de la marca no carga— cae a un placeholder con la inicial.
 */
export function ProductoImagen({
  src,
  nombre,
  className = '',
}: {
  src?: string
  nombre: string
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

  const color = colorPorNombre(nombre)
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ background: `linear-gradient(135deg, ${color}22, ${color}0a)` }}
    >
      <span className="text-4xl font-black" style={{ color }}>
        {nombre.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}
