'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { Producto } from '@/lib/productos'
import { formatearPrecio } from '@/lib/utils'
import { ProductoImagen } from '@/components/catalogo/ProductoImagen'

/** Cuántos artículos se muestran con foto por categoría antes de mandar al catálogo. */
const POR_CATEGORIA = 8

interface Props {
  productos: Producto[]
  categorias: string[]
}

/**
 * La lista de precios en el home: se elige la categoría, se ven los artículos con
 * foto y precio, y quien quiera el detalle completo abre la lista entera en una
 * tabla. El objetivo es que el precio esté a la vista sin obligar a entrar al
 * catálogo, porque es lo primero que el cliente viene a mirar.
 */
export function ListaPreciosGrilla({ productos, categorias }: Props) {
  const [catActiva, setCatActiva] = useState(categorias[0] ?? '')
  const [verTodo, setVerTodo] = useState(false)

  const deLaCategoria = useMemo(
    () => productos.filter((p) => p.categoria === catActiva),
    [productos, catActiva]
  )
  const visibles = deLaCategoria.slice(0, POR_CATEGORIA)
  const restantes = deLaCategoria.length - visibles.length

  return (
    <div>
      {/* Categorías */}
      <div className="flex gap-2 overflow-x-auto sin-barra pb-1 mb-5 justify-start md:justify-center">
        {categorias.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCatActiva(c)}
            className={`shrink-0 text-xs font-bold uppercase tracking-wide px-3.5 py-2 border whitespace-nowrap transition-colors ${
              c === catActiva
                ? 'bg-[#CC0000] border-[#CC0000] text-white'
                : 'border-white/15 text-white/50 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grilla con foto */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {visibles.map((p) => (
          <Link
            key={p.id}
            href="/catalogo"
            className="group border border-white/10 bg-[#131313] flex flex-col overflow-hidden hover:border-white/25 transition-colors"
          >
            <ProductoImagen
              src={p.imagen_url}
              nombre={p.nombre}
              marca={p.marca}
              className="w-full aspect-square"
            />
            <div className="p-2.5 flex flex-col gap-1 flex-1">
              {p.marca && (
                <span className="text-white/35 text-[10px] uppercase tracking-wide">{p.marca}</span>
              )}
              <span className="text-white text-sm leading-tight line-clamp-2 flex-1">{p.nombre}</span>
              {p.presentacion && (
                <span className="text-white/35 text-[11px] leading-tight">{p.presentacion}</span>
              )}
              <span className="text-white font-black text-base leading-none mt-0.5">
                {formatearPrecio(p.precio_minorista)}
                <span className="text-white/40 text-[11px] font-medium"> /u</span>
              </span>
              {p.precio_pack && (
                <span className="text-[#F5C000] text-[11px] font-bold leading-none">
                  Pack {formatearPrecio(p.precio_pack)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {restantes > 0 && (
        <p className="text-white/35 text-xs text-center mt-4">
          Y {restantes} artículo{restantes !== 1 ? 's' : ''} más de {catActiva.toLowerCase()} en la lista completa.
        </p>
      )}

      {/* Lista completa en tabla: todos los precios de un vistazo, sin fotos */}
      <div className="mt-8">
        <button
          type="button"
          onClick={() => setVerTodo((v) => !v)}
          className="w-full border border-white/15 text-white/70 hover:text-white hover:border-white/35 text-xs font-bold uppercase tracking-wide py-3 transition-colors"
        >
          {verTodo ? 'Ocultar lista completa ▲' : `Ver la lista completa (${productos.length} artículos) ▼`}
        </button>

        {verTodo && (
          <div className="mt-4 border border-white/10 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[520px]">
              <thead>
                <tr className="bg-[#131313] text-white/40 text-[10px] uppercase tracking-widest">
                  <th className="px-3 py-2.5 font-bold">Artículo</th>
                  <th className="px-3 py-2.5 font-bold">Presentación</th>
                  <th className="px-3 py-2.5 font-bold text-right">Unidad</th>
                  <th className="px-3 py-2.5 font-bold text-right">Pack cerrado</th>
                </tr>
              </thead>
              {categorias.map((c) => {
                const items = productos.filter((p) => p.categoria === c)
                if (items.length === 0) return null
                return (
                  <tbody key={c}>
                    <tr>
                      <th
                        colSpan={4}
                        className="bg-[#CC0000]/10 text-[#F5C000] text-[11px] uppercase tracking-widest font-black px-3 py-2 text-left"
                      >
                        {c}
                      </th>
                    </tr>
                    {items.map((p) => (
                      <tr key={p.id} className="border-t border-white/5">
                        <td className="px-3 py-2.5 text-white text-sm">{p.nombre}</td>
                        <td className="px-3 py-2.5 text-white/40 text-xs">{p.presentacion}</td>
                        <td className="px-3 py-2.5 text-white text-sm font-bold text-right whitespace-nowrap">
                          {formatearPrecio(p.precio_minorista)}
                        </td>
                        <td className="px-3 py-2.5 text-[#F5C000] text-sm font-bold text-right whitespace-nowrap">
                          {formatearPrecio(p.precio_pack)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )
              })}
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
