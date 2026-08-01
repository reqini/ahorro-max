'use client'

import { useState, useCallback } from 'react'
import { crearPedidoAction, syncPedidoOffline } from './actions'
import { ComprobantePedido } from './ComprobantePedido'
import type { DatosComprobante } from '@/lib/comprobante'
import type { PedidoItem } from '@/lib/pedidos'

const STORAGE_KEY = 'vendedor_pending_pedidos'
const CACHE_KEY = 'vendedor_productos_cache'

interface ProductoCatalogo {
  id: string
  nombre: string
  categoria: string
  precio_minorista: string
  precio_mayorista: string
}

function readProductosCache(): ProductoCatalogo[] {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '[]') } catch { return [] }
}

function formatTotal(items: PedidoItem[]): string {
  const total = items.reduce((sum, it) => {
    const precio = parseFloat(it.precio.replace(/[$,]/g, '')) || 0
    return sum + precio * it.cantidad
  }, 0)
  return `$${total.toFixed(2)}`
}

interface Props {
  onClose: () => void
  serverProductos: ProductoCatalogo[]
}

const INPUT = "w-full bg-[#1a1a1a] border border-white/20 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/30"

export function NuevoPedidoForm({ onClose, serverProductos }: Props) {
  const [tipoPrecio, setTipoPrecio] = useState<'minorista' | 'mayorista'>('minorista')
  const [busqueda, setBusqueda] = useState('')
  const [items, setItems] = useState<PedidoItem[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [comprobante, setComprobante] = useState<{ id: string; datos: DatosComprobante } | null>(null)

  const productos = serverProductos.length > 0 ? serverProductos : readProductosCache()

  const filtrados = productos.filter(p =>
    !busqueda || p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const getPrecio = useCallback((p: ProductoCatalogo) => {
    return tipoPrecio === 'mayorista' ? p.precio_mayorista : p.precio_minorista
  }, [tipoPrecio])

  function addItem(p: ProductoCatalogo) {
    const precio = getPrecio(p)
    setItems(prev => {
      const idx = prev.findIndex(i => i.producto_id === p.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], cantidad: next[idx].cantidad + 1 }
        return next
      }
      return [...prev, { producto_id: p.id, nombre: p.nombre, categoria: p.categoria, precio, cantidad: 1 }]
    })
  }

  function setQty(producto_id: string, qty: number) {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.producto_id !== producto_id))
    } else {
      setItems(prev => prev.map(i => i.producto_id === producto_id ? { ...i, cantidad: qty } : i))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (items.length === 0) { setError('Agregá al menos un producto'); return }
    setError('')

    const fd = new FormData(e.currentTarget)
    fd.set('items', JSON.stringify(items))
    fd.set('tipo_precio', tipoPrecio)
    fd.set('total_estimado', formatTotal(items))

    if (!navigator.onLine) {
      const pending = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
      pending.push({
        id: crypto.randomUUID(),
        cliente_nombre: fd.get('cliente_nombre') ?? '',
        items,
        tipo_precio: tipoPrecio,
        total_estimado: formatTotal(items),
        notas: fd.get('notas') ?? '',
        timestamp: Date.now(),
      })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pending))
      window.dispatchEvent(new CustomEvent('pedido-offline-saved'))
      onClose()
      return
    }

    setSaving(true)
    try {
      const result = await crearPedidoAction(fd)
      if (result.error) { setError(result.error); return }

      // En vez de cerrar, se pasa al comprobante: mandarle la copia al cliente
      // o hacerlo firmar es parte del mismo momento de la venta.
      if (result.id) {
        setComprobante({
          id: result.id,
          datos: {
            numero: result.numero ?? null,
            cliente_nombre: String(fd.get('cliente_nombre') ?? ''),
            items,
            tipo_precio: tipoPrecio,
            total_estimado: formatTotal(items),
            notas: String(fd.get('notas') ?? ''),
          },
        })
        return
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  if (comprobante) {
    return (
      <ComprobantePedido
        pedidoId={comprobante.id}
        pedido={comprobante.datos}
        onListo={onClose}
      />
    )
  }

  const total = formatTotal(items)

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <h2 className="text-white font-bold text-base">Nuevo Pedido</h2>
        <button onClick={onClose} className="text-white/40 hover:text-white text-2xl leading-none">×</button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
        {/* Cliente y tipo precio */}
        <div className="px-4 pt-4 pb-3 border-b border-white/10 flex flex-col gap-3 shrink-0">
          <div>
            <label className="text-white/40 text-xs uppercase tracking-wide block mb-1">Cliente</label>
            <input name="cliente_nombre" placeholder="Nombre del cliente (opcional)" className={INPUT} />
          </div>

          <div>
            <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">Tipo de precio</label>
            <div className="flex gap-2">
              {(['minorista', 'mayorista'] as const).map(t => (
                <button key={t} type="button" onClick={() => setTipoPrecio(t)}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide border transition-colors ${tipoPrecio === t
                    ? t === 'mayorista' ? 'bg-[#F5C000]/20 border-[#F5C000] text-[#F5C000]' : 'bg-white/10 border-white text-white'
                    : 'border-white/20 text-white/40'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Buscar y agregar productos */}
        <div className="px-4 pt-3 pb-2 border-b border-white/10 shrink-0">
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar producto..."
            className={INPUT}
          />
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {filtrados.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-8">
              {productos.length === 0 ? 'Sin productos en caché. Conectate primero.' : 'Sin resultados'}
            </p>
          ) : filtrados.map(p => {
            const item = items.find(i => i.producto_id === p.id)
            const precio = getPrecio(p)
            return (
              <div key={p.id} className="flex items-center px-4 py-3 gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium leading-tight truncate">{p.nombre}</p>
                  {p.categoria && <p className="text-white/30 text-xs">{p.categoria}</p>}
                </div>
                <div className="shrink-0 text-right mr-2">
                  <p className={`text-xs font-bold ${tipoPrecio === 'mayorista' ? 'text-[#F5C000]' : 'text-white'}`}>
                    {precio ? (precio.startsWith('$') ? precio : `$${precio}`) : '—'}
                  </p>
                </div>
                {item ? (
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => setQty(p.id, item.cantidad - 1)}
                      className="w-8 h-8 border border-white/20 text-white text-lg flex items-center justify-center hover:bg-white/10">−</button>
                    <span className="w-8 text-center text-white font-bold text-sm">{item.cantidad}</span>
                    <button type="button" onClick={() => setQty(p.id, item.cantidad + 1)}
                      className="w-8 h-8 border border-[#CC0000] text-[#CC0000] text-lg flex items-center justify-center hover:bg-[#CC0000]/20">+</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => addItem(p)}
                    className="shrink-0 w-8 h-8 border border-[#CC0000] text-[#CC0000] text-xl flex items-center justify-center hover:bg-[#CC0000]/20">+</button>
                )}
              </div>
            )
          })}
        </div>

        {/* Resumen de items seleccionados */}
        {items.length > 0 && (
          <div className="border-t border-white/10 bg-[#111] px-4 py-3 shrink-0">
            <p className="text-white/50 text-xs mb-2 uppercase tracking-wide">{items.length} producto{items.length > 1 ? 's' : ''} seleccionado{items.length > 1 ? 's' : ''}</p>
            <div className="space-y-1 max-h-24 overflow-y-auto mb-2">
              {items.map(it => (
                <div key={it.producto_id} className="flex justify-between text-xs">
                  <span className="text-white/70 truncate">{it.cantidad}× {it.nombre}</span>
                  <span className="text-white/50 shrink-0 ml-2">
                    {it.precio ? `$${(parseFloat(it.precio.replace(/[$,]/g, '')) * it.cantidad).toFixed(0)}` : '—'}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center border-t border-white/10 pt-2">
              <span className="text-white/50 text-xs uppercase tracking-wide">Total estimado</span>
              <span className="text-white font-black text-lg">{total}</span>
            </div>
          </div>
        )}

        {/* Notas y submit */}
        <div className="px-4 py-3 border-t border-white/10 shrink-0 flex flex-col gap-3">
          <textarea name="notas" rows={2} placeholder="Observaciones del pedido..." className={`${INPUT} resize-none`} />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={saving || items.length === 0}
            className="w-full bg-[#CC0000] hover:bg-red-700 text-white font-black uppercase tracking-widest py-3.5 text-sm transition-colors disabled:opacity-40">
            {saving ? 'Guardando...' : `Confirmar pedido${items.length > 0 ? ` · ${total}` : ''}`}
          </button>
        </div>
      </form>
    </div>
  )
}
