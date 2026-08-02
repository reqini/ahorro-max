'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { Producto } from '@/lib/productos'
import { formatearPrecio, parsearPrecio } from '@/lib/utils'
import { calcularAhorro } from '@/lib/ahorro'
import { WhatsAppIcon } from '@/components/atoms/WhatsAppIcon'
import { ProductoImagen } from './ProductoImagen'

interface Props {
  productos: Producto[]
  categorias: string[]
  whatsappNumber: string
}

interface LineaCarrito {
  id: string
  nombre: string
  precio: string
  cantidad: number
}

const CART_KEY = 'catalogo_publico_cart'

function leerCarrito(): LineaCarrito[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') as LineaCarrito[]
  } catch {
    return []
  }
}

/**
 * Tienda pública tipo Mercado Libre con la estética Ahorra Max: grilla con fotos,
 * filtros por categoría, buscador, detalle de producto con comparación de precios
 * contra otras cadenas, y carrito que arma el pedido por WhatsApp.
 */
export function CatalogoPublico({ productos, categorias, whatsappNumber }: Props) {
  const [busqueda, setBusqueda] = useState('')
  const [catActiva, setCatActiva] = useState<string>('')
  const [carrito, setCarrito] = useState<LineaCarrito[]>([])
  const [detalle, setDetalle] = useState<Producto | null>(null)
  const [verCarrito, setVerCarrito] = useState(false)

  useEffect(() => setCarrito(leerCarrito()), [])
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(carrito))
    } catch {
      /* almacenamiento no disponible */
    }
  }, [carrito])

  // Solo productos vendibles: los que tienen precio. Las filas de categoría del
  // Excel (sin precio) se usan para las secciones, no como productos.
  const vendibles = useMemo(
    () => productos.filter((p) => parsearPrecio(p.precio_minorista) > 0),
    [productos]
  )

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return vendibles.filter((p) => {
      if (catActiva && p.categoria !== catActiva) return false
      if (!q) return true
      return p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q)
    })
  }, [vendibles, busqueda, catActiva])

  // Productos con la mayor ventaja de precio contra las cadenas, para la franja
  // destacada. Solo se muestra sin filtros activos, como gancho de entrada.
  const destacados = useMemo(() => {
    return vendibles
      .map((p) => ({ p, ahorro: calcularAhorro(p.precio_minorista, p.comparaciones) }))
      .filter((x): x is { p: Producto; ahorro: NonNullable<ReturnType<typeof calcularAhorro>> } => x.ahorro !== null)
      .sort((a, b) => b.ahorro.ahorroPesos - a.ahorro.ahorroPesos)
      .slice(0, 8)
  }, [vendibles])

  const mostrarDestacados = destacados.length > 0 && !busqueda.trim() && !catActiva

  const totalItems = carrito.reduce((s, l) => s + l.cantidad, 0)
  const totalPesos = carrito.reduce((s, l) => s + parsearPrecio(l.precio) * l.cantidad, 0)

  function agregar(p: Producto) {
    setCarrito((prev) => {
      const i = prev.findIndex((l) => l.id === p.id)
      if (i >= 0) {
        const n = [...prev]
        n[i] = { ...n[i], cantidad: n[i].cantidad + 1 }
        return n
      }
      return [...prev, { id: p.id, nombre: p.nombre, precio: p.precio_minorista, cantidad: 1 }]
    })
  }

  function setCantidad(id: string, cantidad: number) {
    setCarrito((prev) =>
      cantidad <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, cantidad } : l))
    )
  }

  function enviarPorWhatsApp() {
    const lineas = carrito.map((l) => `• ${l.cantidad}x ${l.nombre} — ${formatearPrecio(l.precio) ?? ''}`)
    const msg = `¡Hola! Quiero hacer este pedido:\n${lineas.join('\n')}\n\nTotal estimado: ${formatearPrecio(totalPesos)}`
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
  }

  const enCarrito = (id: string) => carrito.find((l) => l.id === id)?.cantidad ?? 0

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-28">
      {/* Header sticky: buscador + categorías */}
      <header className="sticky top-0 z-30 bg-[#0d0d0d]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-[#CC0000] font-black text-lg tracking-tight shrink-0">
            AHORRA<span className="text-white">MAX</span>
          </Link>
          <div className="relative flex-1">
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar producto o marca..."
              className="w-full bg-[#1a1a1a] border border-white/15 text-white text-sm pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#CC0000] placeholder-white/30"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 pb-2.5 flex gap-2 overflow-x-auto sin-barra">
          <Chip activo={catActiva === ''} onClick={() => setCatActiva('')}>
            Todo
          </Chip>
          {categorias.map((c) => (
            <Chip key={c} activo={catActiva === c} onClick={() => setCatActiva(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </header>

      {/* Franja: comparamos por vos */}
      {mostrarDestacados && (
        <section className="border-b border-white/10 bg-gradient-to-b from-[#CC0000]/8 to-transparent">
          <div className="max-w-5xl mx-auto px-4 py-5">
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <h2 className="text-white font-black text-lg tracking-tight">
                Comparamos por vos <span className="text-[#F5C000]">y ganás</span>
              </h2>
              <span className="text-white/35 text-xs">Precio vs cadenas</span>
            </div>
            <div className="flex gap-3 overflow-x-auto sin-barra pb-1">
              {destacados.map(({ p, ahorro }) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setDetalle(p)}
                  className="shrink-0 w-40 border border-[#F5C000]/25 bg-[#131313] text-left overflow-hidden hover:border-[#F5C000]/50 transition-colors"
                >
                  <div className="relative">
                    <ProductoImagen src={p.imagen_url} nombre={p.nombre} className="w-full h-28" />
                    <span className="absolute top-1.5 left-1.5 bg-[#F5C000] text-black text-[10px] font-black px-1.5 py-0.5">
                      -{ahorro.ahorroPorcentaje}%
                    </span>
                  </div>
                  <div className="p-2.5">
                    <p className="text-white text-xs leading-tight line-clamp-2 h-8">{p.nombre}</p>
                    <p className="text-white font-black text-base mt-1 leading-none">
                      {formatearPrecio(p.precio_minorista)}
                    </p>
                    <p className="text-[#F5C000] text-[11px] font-bold mt-0.5">
                      Ahorrás {formatearPrecio(ahorro.ahorroPesos)}
                    </p>
                    <p className="text-white/30 text-[10px] mt-0.5">vs {ahorro.referencia.cadena}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grilla de productos */}
      <main className="max-w-5xl mx-auto px-4 py-5">
        {filtrados.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-16">No encontramos productos con ese filtro.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtrados.map((p) => {
              const ahorro = calcularAhorro(p.precio_minorista, p.comparaciones)
              const cant = enCarrito(p.id)
              return (
                <div
                  key={p.id}
                  className="group border border-white/10 bg-[#131313] flex flex-col overflow-hidden hover:border-white/25 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setDetalle(p)}
                    className="relative aspect-square w-full"
                    aria-label={`Ver ${p.nombre}`}
                  >
                    <ProductoImagen src={p.imagen_url} nombre={p.nombre} className="w-full h-full" />
                    {ahorro && (
                      <span className="absolute top-2 left-2 bg-[#F5C000] text-black text-[10px] font-black px-1.5 py-0.5 uppercase">
                        -{ahorro.ahorroPorcentaje}% vs {ahorro.referencia.cadena}
                      </span>
                    )}
                  </button>

                  <div className="p-2.5 flex flex-col gap-1.5 flex-1">
                    {p.marca && (
                      <span className="text-white/35 text-[10px] uppercase tracking-wide">{p.marca}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setDetalle(p)}
                      className="text-white text-sm leading-tight text-left line-clamp-2 flex-1"
                    >
                      {p.nombre}
                    </button>
                    <p className="text-white font-black text-lg leading-none">
                      {formatearPrecio(p.precio_minorista)}
                    </p>

                    {cant > 0 ? (
                      <div className="flex items-center justify-between border border-[#CC0000]/50 mt-1">
                        <button onClick={() => setCantidad(p.id, cant - 1)} className="w-9 h-9 text-white/70 hover:text-white text-lg">
                          −
                        </button>
                        <span className="text-white font-bold text-sm">{cant}</span>
                        <button onClick={() => agregar(p)} className="w-9 h-9 text-white/70 hover:text-white text-lg">
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => agregar(p)}
                        className="mt-1 w-full py-2 bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wide transition-colors"
                      >
                        Agregar
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Barra flotante de carrito */}
      {totalItems > 0 && !verCarrito && !detalle && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-3">
          <button
            onClick={() => setVerCarrito(true)}
            className="max-w-5xl mx-auto w-full flex items-center justify-between bg-[#CC0000] hover:bg-red-700 text-white px-5 py-4 shadow-2xl shadow-black/60 transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <span className="bg-white text-[#CC0000] font-black text-xs w-6 h-6 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
              <span className="font-bold text-sm">Ver mi pedido</span>
            </span>
            <span className="font-black text-lg">{formatearPrecio(totalPesos)}</span>
          </button>
        </div>
      )}

      {detalle && (
        <DetalleProducto
          producto={detalle}
          cantidad={enCarrito(detalle.id)}
          onAgregar={() => agregar(detalle)}
          onQuitar={() => setCantidad(detalle.id, enCarrito(detalle.id) - 1)}
          onCerrar={() => setDetalle(null)}
        />
      )}

      {verCarrito && (
        <Carrito
          carrito={carrito}
          total={totalPesos}
          onCantidad={setCantidad}
          onEnviar={enviarPorWhatsApp}
          onCerrar={() => setVerCarrito(false)}
        />
      )}
    </div>
  )
}

function Chip({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 text-xs font-bold uppercase tracking-wide px-3.5 py-1.5 border whitespace-nowrap transition-colors ${
        activo ? 'bg-[#CC0000] border-[#CC0000] text-white' : 'border-white/15 text-white/50 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

function DetalleProducto({
  producto,
  cantidad,
  onAgregar,
  onQuitar,
  onCerrar,
}: {
  producto: Producto
  cantidad: number
  onAgregar: () => void
  onQuitar: () => void
  onCerrar: () => void
}) {
  const ahorro = calcularAhorro(producto.precio_minorista, producto.comparaciones)

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <span className="text-white/50 text-sm">{producto.categoria || 'Producto'}</span>
        <button onClick={onCerrar} className="text-white/50 hover:text-white text-2xl leading-none w-8 h-8">
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto max-w-2xl mx-auto w-full">
        <ProductoImagen src={producto.imagen_url} nombre={producto.nombre} className="w-full aspect-square max-h-80" />

        <div className="p-5 space-y-4">
          <div>
            {producto.marca && (
              <p className="text-white/40 text-xs uppercase tracking-wide">{producto.marca}</p>
            )}
            <h2 className="text-white text-xl font-bold mt-0.5">{producto.nombre}</h2>
            {producto.descripcion && <p className="text-white/50 text-sm mt-1">{producto.descripcion}</p>}
          </div>

          <div className="flex items-end gap-3">
            <p className="text-white font-black text-3xl">{formatearPrecio(producto.precio_minorista)}</p>
            {ahorro && (
              <span className="text-[#F5C000] text-sm font-bold pb-1">
                Ahorrás {formatearPrecio(ahorro.ahorroPesos)}
              </span>
            )}
          </div>

          {/* Comparación con cadenas */}
          {producto.comparaciones.length > 0 && (
            <div className="border border-white/10 bg-[#111]">
              <p className="text-white/50 text-[11px] uppercase tracking-widest font-bold px-4 py-2.5 border-b border-white/10">
                Nuestro precio vs las cadenas
              </p>
              <div className="divide-y divide-white/5">
                <div className="flex items-center justify-between px-4 py-3 bg-[#CC0000]/10">
                  <span className="text-white font-bold text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#CC0000]" /> Ahorra Max
                  </span>
                  <span className="text-white font-black">{formatearPrecio(producto.precio_minorista)}</span>
                </div>
                {producto.comparaciones.map((c, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <span className="text-white/60 text-sm">{c.cadena}</span>
                    <span className="flex items-center gap-3">
                      <span className="text-white/50 line-through">{formatearPrecio(c.precio)}</span>
                      {c.url && (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#F5C000] text-xs hover:underline"
                        >
                          ver →
                        </a>
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-white/25 text-[10px] px-4 py-2">
                Precios de referencia informados por el cliente. Verificá en el link de cada cadena.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 p-4 shrink-0 max-w-2xl mx-auto w-full">
        {cantidad > 0 ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-white/20">
              <button onClick={onQuitar} className="w-12 h-12 text-white/70 text-xl">
                −
              </button>
              <span className="w-10 text-center text-white font-bold">{cantidad}</span>
              <button onClick={onAgregar} className="w-12 h-12 text-white/70 text-xl">
                +
              </button>
            </div>
            <button
              onClick={onCerrar}
              className="flex-1 py-3.5 bg-[#CC0000] hover:bg-red-700 text-white font-bold uppercase tracking-wide transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        ) : (
          <button
            onClick={onAgregar}
            className="w-full py-4 bg-[#CC0000] hover:bg-red-700 text-white font-black uppercase tracking-wide transition-colors"
          >
            Agregar al pedido
          </button>
        )}
      </div>
    </div>
  )
}

function Carrito({
  carrito,
  total,
  onCantidad,
  onEnviar,
  onCerrar,
}: {
  carrito: LineaCarrito[]
  total: number
  onCantidad: (id: string, cantidad: number) => void
  onEnviar: () => void
  onCerrar: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <h2 className="text-white font-black text-lg">Mi pedido</h2>
        <button onClick={onCerrar} className="text-white/50 hover:text-white text-2xl leading-none w-8 h-8">
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto max-w-2xl mx-auto w-full divide-y divide-white/5">
        {carrito.map((l) => (
          <div key={l.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{l.nombre}</p>
              <p className="text-white/40 text-xs">{formatearPrecio(l.precio)} c/u</p>
            </div>
            <div className="flex items-center border border-white/20 shrink-0">
              <button onClick={() => onCantidad(l.id, l.cantidad - 1)} className="w-9 h-9 text-white/70 text-lg">
                −
              </button>
              <span className="w-8 text-center text-white text-sm font-bold">{l.cantidad}</span>
              <button onClick={() => onCantidad(l.id, l.cantidad + 1)} className="w-9 h-9 text-white/70 text-lg">
                +
              </button>
            </div>
            <p className="text-white font-bold text-sm w-20 text-right shrink-0">
              {formatearPrecio(parsearPrecio(l.precio) * l.cantidad)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 p-4 shrink-0 max-w-2xl mx-auto w-full space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-sm uppercase tracking-wide">Total estimado</span>
          <span className="text-white font-black text-2xl">{formatearPrecio(total)}</span>
        </div>
        <button
          onClick={onEnviar}
          className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-black font-black uppercase tracking-wide transition-colors flex items-center justify-center gap-2.5"
        >
          <WhatsAppIcon className="w-5 h-5" />
          Enviar pedido por WhatsApp
        </button>
        <p className="text-white/30 text-[11px] text-center">
          Se abre WhatsApp con tu pedido escrito. Coordinás la entrega y el pago por ahí.
        </p>
      </div>
    </div>
  )
}
