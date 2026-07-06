'use client'

import { useState, useEffect, useMemo, useCallback, useTransition } from 'react'
import { OfflineBar } from '@/components/ui/OfflineBar'

export interface ProductoCatalogo {
  id: string
  nombre: string
  categoria: string
  descripcion: string
  precio_minorista: string
  precio_mayorista: string
}

export interface ClienteCatalogo {
  id: string
  nombre: string
  telefono?: string
  tipo_negocio?: string
}

interface CartItem {
  producto_id: string
  nombre: string
  categoria: string
  precio: string
  precio_minorista: string
  precio_mayorista: string
  cantidad: number
}

export type ModoCatalogo = 'publico' | 'vendedor' | 'admin'

interface PedidoPayload {
  cliente_nombre: string
  cliente_id?: string
  items: CartItem[]
  tipo_precio: 'minorista' | 'mayorista'
  total_estimado: string
  notas: string
}

interface Props {
  productos: ProductoCatalogo[]
  categorias: string[]
  modo: ModoCatalogo
  clientes?: ClienteCatalogo[]
  whatsappNumber?: string
  onCrearPedido?: (data: PedidoPayload) => Promise<{ id?: string | null; error?: string }>
}

const fmt = (p: string) => p ? (p.startsWith('$') ? p : `$${p}`) : null
const parseNum = (p: string) => parseFloat((p ?? '').replace(/[$,\s]/g, '')) || 0

function calcTotal(items: CartItem[]): number {
  return items.reduce((s, it) => s + parseNum(it.precio) * it.cantidad, 0)
}

const cartStorageKey = (modo: ModoCatalogo) => `catalogo_cart_${modo}`
const PENDING_PEDIDOS_KEY = 'vendedor_pending_pedidos'

function queuePedidoOffline(payload: PedidoPayload) {
  try {
    const pending = JSON.parse(localStorage.getItem(PENDING_PEDIDOS_KEY) ?? '[]')
    pending.push({
      id: crypto.randomUUID(),
      cliente_nombre: payload.cliente_nombre,
      items: payload.items,
      tipo_precio: payload.tipo_precio,
      total_estimado: payload.total_estimado,
      notas: payload.notas,
      timestamp: Date.now(),
    })
    localStorage.setItem(PENDING_PEDIDOS_KEY, JSON.stringify(pending))
    window.dispatchEvent(new CustomEvent('pedido-offline-saved'))
    return true
  } catch {
    return false
  }
}

function loadCartFromStorage(modo: ModoCatalogo): CartItem[] {
  try {
    const raw = localStorage.getItem(cartStorageKey(modo))
    return raw ? JSON.parse(raw) as CartItem[] : []
  } catch {
    return []
  }
}

export function CatalogoCards({ productos, categorias, modo, clientes = [], whatsappNumber, onCrearPedido }: Props) {
  const [tipoPrecio, setTipoPrecio] = useState<'minorista' | 'mayorista'>('minorista')
  const [busqueda, setBusqueda] = useState('')
  const [catFiltro, setCatFiltro] = useState('')
  const [cart, setCart] = useState<CartItem[]>(() => loadCartFromStorage(modo))
  const [showOrder, setShowOrder] = useState(false)

  // Persist cart so it survives page refresh / navigation
  useEffect(() => {
    try {
      if (cart.length === 0) localStorage.removeItem(cartStorageKey(modo))
      else localStorage.setItem(cartStorageKey(modo), JSON.stringify(cart))
    } catch {
      // localStorage not available (private mode, full, etc.)
    }
  }, [cart, modo])

  // Order form state
  const [clienteQuery, setClienteQuery] = useState('')
  const [clienteId, setClienteId] = useState<string | undefined>()
  const [notas, setNotas] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [offlineQueued, setOfflineQueued] = useState(false)
  const [, startTransition] = useTransition()

  const filtrados = useMemo(() => {
    return productos.filter(p => {
      const matchCat = !catFiltro || p.categoria === catFiltro
      const matchQ = !busqueda || p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.categoria?.toLowerCase().includes(busqueda.toLowerCase())
      return matchCat && matchQ
    })
  }, [productos, catFiltro, busqueda])

  const clientesSugeridos = useMemo(() => {
    if (!clienteQuery.trim() || clientes.length === 0) return []
    const q = clienteQuery.toLowerCase()
    return clientes.filter(c => c.nombre.toLowerCase().includes(q)).slice(0, 5)
  }, [clienteQuery, clientes])

  function getPrecio(p: ProductoCatalogo) {
    return tipoPrecio === 'mayorista' ? p.precio_mayorista : p.precio_minorista
  }

  const addToCart = useCallback((p: ProductoCatalogo) => {
    const precio = getPrecio(p)
    setCart(prev => {
      const idx = prev.findIndex(i => i.producto_id === p.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], cantidad: next[idx].cantidad + 1, precio }
        return next
      }
      return [...prev, { producto_id: p.id, nombre: p.nombre, categoria: p.categoria, precio, precio_minorista: p.precio_minorista, precio_mayorista: p.precio_mayorista, cantidad: 1 }]
    })
  }, [tipoPrecio]) // eslint-disable-line react-hooks/exhaustive-deps

  function setQty(producto_id: string, qty: number) {
    if (qty <= 0) setCart(prev => prev.filter(i => i.producto_id !== producto_id))
    else setCart(prev => prev.map(i => i.producto_id === producto_id ? { ...i, cantidad: qty } : i))
  }

  function resetOrder() {
    setCart([])
    setShowOrder(false)
    setClienteQuery('')
    setClienteId(undefined)
    setNotas('')
    setError('')
    setSuccess(false)
    setOfflineQueued(false)
  }

  const totalNum = calcTotal(cart)
  const totalFmt = `$${totalNum.toFixed(0)}`
  const totalItems = cart.reduce((s, i) => s + i.cantidad, 0)

  async function handleConfirmar() {
    if (cart.length === 0) return
    setError('')

    const payload: PedidoPayload = {
      cliente_nombre: clienteQuery.trim() || 'Sin nombre',
      cliente_id: clienteId,
      items: cart,
      tipo_precio: tipoPrecio,
      total_estimado: totalFmt,
      notas,
    }

    if (modo === 'publico' && whatsappNumber) {
      const lines = cart.map(it => `• ${it.cantidad}x ${it.nombre} — ${fmt(it.precio) ?? 'consultar'}`)
      const msg = `Hola! Quiero hacer un pedido:\n${lines.join('\n')}\n\nTotal estimado: ${totalFmt}${notas ? `\n\nNota: ${notas}` : ''}`
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank')
      resetOrder()
      return
    }

    if (!onCrearPedido) return

    if (!navigator.onLine) {
      queuePedidoOffline(payload)
      setOfflineQueued(true)
      setSuccess(true)
      setTimeout(resetOrder, 2000)
      return
    }

    setSaving(true)
    try {
      const res = await onCrearPedido(payload)
      if (res.error) { setError(res.error); return }
      setSuccess(true)
      setTimeout(resetOrder, 1500)
    } catch {
      // Went offline mid-request, or a network blip — don't lose the pedido
      queuePedidoOffline(payload)
      setOfflineQueued(true)
      setSuccess(true)
      setTimeout(resetOrder, 2000)
    } finally {
      setSaving(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-5xl mb-4">{offlineQueued ? '📴' : '✓'}</div>
          <p className="text-white font-black text-xl">
            {offlineQueued ? 'Guardado sin conexión' : 'Pedido registrado'}
          </p>
          {offlineQueued && (
            <p className="text-amber-400/80 text-xs mt-2 max-w-xs mx-auto">
              Se sincroniza solo cuando vuelva la señal — revisá &quot;Pedidos&quot; para confirmarlo.
            </p>
          )}
          <p className="text-white/40 text-sm mt-2">Total: {totalFmt}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
      {modo === 'vendedor' && <OfflineBar offlineMessage="el pedido se guarda localmente" />}

      {/* Tipo precio toggle */}
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/8 px-4 pt-3 pb-3 flex flex-col gap-2.5">
        {/* Precio toggle */}
        <div className="flex gap-2">
          {(['minorista', 'mayorista'] as const).map(t => (
            <button key={t} onClick={() => {
              setTipoPrecio(t)
              setCart(prev => prev.map(it => ({
                ...it,
                precio: t === 'mayorista' ? it.precio_mayorista : it.precio_minorista,
              })))
            }}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-widest border transition-colors ${tipoPrecio === t
                ? t === 'mayorista' ? 'bg-[#F5C000] border-[#F5C000] text-black' : 'bg-[#CC0000] border-[#CC0000] text-white'
                : 'border-white/15 text-white/40 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full bg-[#111] border border-white/15 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/25 pr-8" />
          {busqueda && <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">×</button>}
        </div>

        {/* Categorías */}
        {categorias.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
            <button onClick={() => setCatFiltro('')}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wide whitespace-nowrap border transition-colors shrink-0 ${!catFiltro ? 'bg-[#CC0000] border-[#CC0000] text-white' : 'border-white/15 text-white/40 hover:text-white'}`}>
              Todos ({productos.length})
            </button>
            {categorias.map(cat => (
              <button key={cat} onClick={() => setCatFiltro(cat === catFiltro ? '' : cat)}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wide whitespace-nowrap border transition-colors shrink-0 ${catFiltro === cat ? 'bg-[#CC0000] border-[#CC0000] text-white' : 'border-white/15 text-white/40 hover:text-white'}`}>
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid de cards */}
      <div className="flex-1 px-3 py-4 pb-28">
        {filtrados.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-white/25 text-sm">{busqueda ? `Sin resultados para "${busqueda}"` : 'Sin productos'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtrados.map(p => {
              const item = cart.find(i => i.producto_id === p.id)
              const precioMin = fmt(p.precio_minorista)
              const precioMay = fmt(p.precio_mayorista)
              const precioActivo = tipoPrecio === 'mayorista' ? precioMay : precioMin

              return (
                <div key={p.id} className="bg-[#111] border border-white/8 flex flex-col overflow-hidden hover:border-white/20 transition-colors">
                  {/* Placeholder visual */}
                  <div className="bg-[#1a1a1a] aspect-square flex items-center justify-center relative">
                    <span className="text-white/10 font-black text-5xl uppercase select-none">
                      {p.nombre.charAt(0)}
                    </span>
                    {p.categoria && (
                      <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide bg-[#CC0000]/20 text-[#CC0000] px-1.5 py-0.5 border border-[#CC0000]/30">
                        {p.categoria}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 p-3 gap-2">
                    <p className="text-white font-bold text-sm leading-tight line-clamp-2">{p.nombre}</p>
                    {p.descripcion && <p className="text-white/30 text-xs line-clamp-1">{p.descripcion}</p>}

                    {/* Precio (según tipo activo) */}
                    <div className="mt-auto pt-1">
                      {precioActivo ? (
                        <div>
                          <p className={`text-[9px] uppercase leading-none mb-0.5 ${tipoPrecio === 'mayorista' ? 'text-[#F5C000]/50' : 'text-white/30'}`}>
                            {tipoPrecio}
                          </p>
                          <p className={`font-black text-sm ${tipoPrecio === 'mayorista' ? 'text-[#F5C000]' : 'text-white'}`}>
                            {precioActivo}
                          </p>
                        </div>
                      ) : (
                        <p className="text-white/20 text-xs">Sin precio {tipoPrecio}</p>
                      )}
                    </div>

                    {/* Botón agregar */}
                    {item ? (
                      <div className="flex items-center justify-between border border-white/15 mt-1">
                        <button onClick={() => setQty(p.id, item.cantidad - 1)}
                          className="w-9 h-9 text-white/60 hover:text-white hover:bg-white/5 transition-colors text-lg font-bold flex items-center justify-center">−</button>
                        <span className="text-white font-black text-base tabular-nums">{item.cantidad}</span>
                        <button onClick={() => setQty(p.id, item.cantidad + 1)}
                          className="w-9 h-9 text-[#CC0000] hover:bg-[#CC0000]/10 transition-colors text-lg font-bold flex items-center justify-center">+</button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(p)}
                        className="mt-1 w-full py-2 bg-[#CC0000]/10 hover:bg-[#CC0000] border border-[#CC0000]/40 hover:border-[#CC0000] text-[#CC0000] hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
                        + Agregar
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cart bar flotante */}
      {cart.length > 0 && !showOrder && (
        <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2">
          <button onClick={() => setShowOrder(true)}
            className="w-full max-w-2xl mx-auto flex items-center justify-between bg-[#CC0000] hover:bg-red-700 text-white px-5 py-4 shadow-2xl shadow-black/60 transition-colors">
            <div className="flex items-center gap-3">
              <span className="bg-white text-[#CC0000] font-black text-xs w-6 h-6 rounded-full flex items-center justify-center">{totalItems}</span>
              <span className="font-bold text-sm">{totalItems} producto{totalItems !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg">{totalFmt}</span>
              <span className="text-white/70 text-sm">→</span>
            </div>
          </button>
        </div>
      )}

      {/* Modal de pedido */}
      {showOrder && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 shrink-0">
            <div>
              <h2 className="text-white font-black text-lg">Confirmar pedido</h2>
              <p className="text-white/30 text-xs">{totalItems} producto{totalItems !== 1 ? 's' : ''} · {totalFmt}</p>
            </div>
            <button onClick={() => setShowOrder(false)} className="text-white/30 hover:text-white text-3xl leading-none w-10 h-10 flex items-center justify-center">×</button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Cliente */}
            <div className="px-4 pt-4 pb-3 border-b border-white/8">
              <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">
                {modo === 'publico' ? 'Tu nombre (opcional)' : 'Cliente'}
              </label>
              <div className="relative">
                <input
                  value={clienteQuery}
                  onChange={e => { setClienteQuery(e.target.value); setClienteId(undefined) }}
                  placeholder={modo === 'publico' ? 'Tu nombre...' : 'Buscar o escribir cliente...'}
                  className="w-full bg-[#1a1a1a] border border-white/15 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/20"
                />
                {/* Sugerencias */}
                {clientesSugeridos.length > 0 && !clienteId && (
                  <div className="absolute top-full left-0 right-0 bg-[#1a1a1a] border border-white/20 border-t-0 z-10 max-h-40 overflow-y-auto">
                    {clientesSugeridos.map(c => (
                      <button key={c.id} type="button"
                        onClick={() => { setClienteQuery(c.nombre); setClienteId(c.id) }}
                        className="w-full text-left px-3 py-2.5 hover:bg-white/5 border-b border-white/5 last:border-0">
                        <p className="text-white text-sm font-medium">{c.nombre}</p>
                        {c.tipo_negocio && <p className="text-white/30 text-xs">{c.tipo_negocio}</p>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {clienteId && (
                <p className="text-green-400 text-xs mt-1.5 flex items-center gap-1">
                  <span>✓</span> Cliente existente seleccionado
                  <button onClick={() => { setClienteId(undefined) }} className="text-white/30 hover:text-white ml-1 underline">cambiar</button>
                </p>
              )}
            </div>

            {/* Items */}
            <div className="px-4 pt-3 pb-2 border-b border-white/8">
              <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Productos</p>
              <div className="space-y-2">
                {cart.map(it => (
                  <div key={it.producto_id} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => setQty(it.producto_id, it.cantidad - 1)}
                        className="w-7 h-7 border border-white/15 text-white/50 hover:text-white flex items-center justify-center text-sm">−</button>
                      <span className="w-7 text-center text-white font-bold text-sm">{it.cantidad}</span>
                      <button onClick={() => setQty(it.producto_id, it.cantidad + 1)}
                        className="w-7 h-7 border border-white/15 text-white/50 hover:text-white flex items-center justify-center text-sm">+</button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm leading-tight truncate">{it.nombre}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={`font-bold text-sm ${tipoPrecio === 'mayorista' ? 'text-[#F5C000]' : 'text-white'}`}>
                        {fmt(it.precio) ?? '—'}
                      </p>
                      {parseNum(it.precio) > 0 && (
                        <p className="text-white/30 text-xs">${(parseNum(it.precio) * it.cantidad).toFixed(0)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10">
                <span className="text-white/50 text-sm uppercase tracking-wide">Total estimado</span>
                <span className="text-white font-black text-2xl">{totalFmt}</span>
              </div>
            </div>

            {/* Notas */}
            <div className="px-4 pt-3 pb-4">
              <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">Observaciones</label>
              <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={2}
                placeholder="Fecha de entrega, condiciones especiales..."
                className="w-full bg-[#1a1a1a] border border-white/15 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/20 resize-none" />
            </div>
          </div>

          {/* Submit */}
          <div className="px-4 pb-6 pt-3 border-t border-white/10 shrink-0">
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <button onClick={handleConfirmar} disabled={saving || cart.length === 0}
              className="w-full bg-[#CC0000] hover:bg-red-700 text-white font-black uppercase tracking-widest py-4 text-sm transition-colors disabled:opacity-40">
              {saving ? 'Guardando...' : modo === 'publico' ? `Enviar por WhatsApp · ${totalFmt}` : `Confirmar pedido · ${totalFmt}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
