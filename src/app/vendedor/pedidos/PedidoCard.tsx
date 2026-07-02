'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { editarPedidoAction, eliminarPedidoAction } from './actions'
import type { Pedido, PedidoItem } from '@/lib/pedidos'

const EDIT_WINDOW_MS = 30 * 60 * 1000
const CACHE_KEY = 'vendedor_productos_cache'

interface ProductoCatalogo {
  id: string
  nombre: string
  categoria: string
  precio_minorista: string
  precio_mayorista: string
}

const fmt = (p: string) => p ? (p.startsWith('$') ? p : `$${p}`) : null
const parseNum = (p: string) => parseFloat((p ?? '').replace(/[$,\s]/g, '')) || 0

function useTimer(createdAt: string) {
  const [msLeft, setMsLeft] = useState(() => Math.max(0, EDIT_WINDOW_MS - (Date.now() - new Date(createdAt).getTime())))
  useEffect(() => {
    if (msLeft <= 0) return
    const id = setInterval(() => {
      const left = Math.max(0, EDIT_WINDOW_MS - (Date.now() - new Date(createdAt).getTime()))
      setMsLeft(left)
      if (left <= 0) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [createdAt, msLeft])
  return msLeft
}

function formatTime(ms: number) {
  const min = Math.floor(ms / 60000)
  const sec = Math.floor((ms % 60000) / 1000)
  return `${min}:${sec.toString().padStart(2, '0')}`
}

const ESTADO_COLOR: Record<string, string> = {
  pendiente: 'text-amber-400 border-amber-700/40 bg-amber-950/30',
  confirmado: 'text-blue-400 border-blue-700/40 bg-blue-950/30',
  entregado: 'text-green-400 border-green-700/40 bg-green-950/30',
  cancelado: 'text-white/30 border-white/10 bg-white/5',
}
const ESTADO_LABEL: Record<string, string> = { pendiente: 'Pendiente', confirmado: 'Confirmado', entregado: 'Entregado', cancelado: 'Cancelado' }

interface Props {
  pedido: Pedido
  serverProductos: ProductoCatalogo[]
}

export function PedidoCard({ pedido, serverProductos }: Props) {
  const router = useRouter()
  const msLeft = useTimer(pedido.created_at)
  const canEdit = msLeft > 0
  const [expanded, setExpanded] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Edit state
  const [editItems, setEditItems] = useState<PedidoItem[]>(pedido.items ?? [])
  const [editCliente, setEditCliente] = useState(pedido.cliente_nombre)
  const [editNotas, setEditNotas] = useState(pedido.notas ?? '')
  const [editTipo, setEditTipo] = useState<'minorista' | 'mayorista'>(pedido.tipo_precio)
  const [busqueda, setBusqueda] = useState('')

  const productos: ProductoCatalogo[] = serverProductos.length > 0 ? serverProductos : (() => {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '[]') } catch { return [] }
  })()

  const filtrados = productos.filter(p => !busqueda || p.nombre.toLowerCase().includes(busqueda.toLowerCase()))

  function getPrecio(p: ProductoCatalogo) {
    return editTipo === 'mayorista' ? p.precio_mayorista : p.precio_minorista
  }

  function addItem(p: ProductoCatalogo) {
    const precio = getPrecio(p)
    setEditItems(prev => {
      const idx = prev.findIndex(i => i.producto_id === p.id)
      if (idx >= 0) { const n = [...prev]; n[idx] = { ...n[idx], cantidad: n[idx].cantidad + 1 }; return n }
      return [...prev, { producto_id: p.id, nombre: p.nombre, categoria: p.categoria, precio, cantidad: 1 }]
    })
  }

  function setQty(producto_id: string, qty: number) {
    if (qty <= 0) setEditItems(prev => prev.filter(i => i.producto_id !== producto_id))
    else setEditItems(prev => prev.map(i => i.producto_id === producto_id ? { ...i, cantidad: qty } : i))
  }

  const totalEdit = `$${editItems.reduce((s, it) => s + parseNum(it.precio) * it.cantidad, 0).toFixed(0)}`

  async function handleSave() {
    if (editItems.length === 0) { setError('Agregá al menos un producto'); return }
    setSaving(true)
    setError('')
    try {
      const res = await editarPedidoAction(pedido.id, {
        cliente_nombre: editCliente || 'Sin nombre',
        items: editItems,
        tipo_precio: editTipo,
        total_estimado: totalEdit,
        notas: editNotas,
      })
      if (res.error) { setError(res.error); return }
      setShowEdit(false)
      router.refresh()
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) return
    setDeleting(true)
    const res = await eliminarPedidoAction(pedido.id)
    if (res.error) { alert(res.error); setDeleting(false); return }
    router.refresh()
  }

  return (
    <>
      {/* Edit modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col max-w-2xl mx-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
            <h2 className="text-white font-black text-base">Editar pedido #{pedido.numero}</h2>
            <button onClick={() => setShowEdit(false)} className="text-white/40 hover:text-white text-2xl w-8 h-8 flex items-center justify-center">×</button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Tipo precio */}
            <div className="px-4 pt-3 pb-2 border-b border-white/8 flex gap-2">
              {(['minorista', 'mayorista'] as const).map(t => (
                <button key={t} onClick={() => setEditTipo(t)} type="button"
                  className={`flex-1 py-2 text-xs font-black uppercase tracking-widest border transition-colors ${editTipo === t
                    ? t === 'mayorista' ? 'bg-[#F5C000] border-[#F5C000] text-black' : 'bg-[#CC0000] border-[#CC0000] text-white'
                    : 'border-white/15 text-white/40'}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* Buscar productos */}
            <div className="px-4 pt-3 pb-2 border-b border-white/8">
              <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar y agregar producto..."
                className="w-full bg-[#1a1a1a] border border-white/15 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] placeholder-white/20" />
            </div>

            {busqueda && (
              <div className="border-b border-white/8 max-h-48 overflow-y-auto divide-y divide-white/5">
                {filtrados.map(p => {
                  const item = editItems.find(i => i.producto_id === p.id)
                  return (
                    <div key={p.id} className="flex items-center px-4 py-2.5 gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{p.nombre}</p>
                        <p className="text-white/30 text-xs">{p.categoria}</p>
                      </div>
                      <p className={`text-sm font-bold shrink-0 ${editTipo === 'mayorista' ? 'text-[#F5C000]' : 'text-white'}`}>
                        {fmt(getPrecio(p)) ?? '—'}
                      </p>
                      {item ? (
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => setQty(p.id, item.cantidad - 1)} className="w-7 h-7 border border-white/15 text-white flex items-center justify-center">−</button>
                          <span className="w-6 text-center text-white font-bold text-sm">{item.cantidad}</span>
                          <button onClick={() => setQty(p.id, item.cantidad + 1)} className="w-7 h-7 border border-[#CC0000] text-[#CC0000] flex items-center justify-center">+</button>
                        </div>
                      ) : (
                        <button onClick={() => addItem(p)} className="w-7 h-7 border border-[#CC0000] text-[#CC0000] flex items-center justify-center text-lg shrink-0">+</button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Items actuales */}
            <div className="px-4 pt-3 pb-2 border-b border-white/8">
              <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Productos en el pedido</p>
              {editItems.length === 0 ? (
                <p className="text-white/20 text-sm">Sin productos</p>
              ) : (
                <div className="space-y-2">
                  {editItems.map(it => (
                    <div key={it.producto_id} className="flex items-center gap-2">
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => setQty(it.producto_id, it.cantidad - 1)} className="w-7 h-7 border border-white/15 text-white/50 flex items-center justify-center text-sm">−</button>
                        <span className="w-6 text-center text-white font-bold text-sm">{it.cantidad}</span>
                        <button onClick={() => setQty(it.producto_id, it.cantidad + 1)} className="w-7 h-7 border border-white/15 text-white/50 flex items-center justify-center text-sm">+</button>
                      </div>
                      <p className="flex-1 text-white text-sm truncate">{it.nombre}</p>
                      <p className={`text-sm font-bold shrink-0 ${editTipo === 'mayorista' ? 'text-[#F5C000]' : 'text-white'}`}>{fmt(it.precio) ?? '—'}</p>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-white/8">
                    <span className="text-white/40 text-sm">Total</span>
                    <span className="text-white font-black text-lg">{totalEdit}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Cliente y notas */}
            <div className="px-4 pt-3 pb-4 flex flex-col gap-3">
              <div>
                <label className="text-white/40 text-xs uppercase tracking-wide block mb-1">Cliente</label>
                <input value={editCliente} onChange={e => setEditCliente(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/15 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#CC0000]" />
              </div>
              <div>
                <label className="text-white/40 text-xs uppercase tracking-wide block mb-1">Observaciones</label>
                <textarea value={editNotas} onChange={e => setEditNotas(e.target.value)} rows={2}
                  className="w-full bg-[#1a1a1a] border border-white/15 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] resize-none" />
              </div>
            </div>
          </div>

          <div className="px-4 pb-6 pt-3 border-t border-white/10 shrink-0">
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <button onClick={handleSave} disabled={saving}
              className="w-full bg-[#CC0000] hover:bg-red-700 text-white font-black uppercase tracking-widest py-3.5 text-sm disabled:opacity-40 transition-colors">
              {saving ? 'Guardando...' : `Guardar cambios · ${totalEdit}`}
            </button>
          </div>
        </div>
      )}

      {/* Card */}
      <div className="px-4 py-4 border-b border-white/5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <button onClick={() => setExpanded(v => !v)} className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2">
              <span className="text-white/20 text-xs font-mono shrink-0">#{pedido.numero}</span>
              <p className="text-white font-bold text-sm truncate">{pedido.cliente_nombre || 'Sin nombre'}</p>
            </div>
            <p className="text-white/30 text-xs mt-0.5">
              {new Date(pedido.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
              {pedido.tipo_precio && <span className="ml-2 capitalize opacity-60">{pedido.tipo_precio}</span>}
            </p>
          </button>
          <div className="shrink-0 text-right">
            <span className={`text-xs px-2 py-0.5 border font-medium ${ESTADO_COLOR[pedido.estado]}`}>
              {ESTADO_LABEL[pedido.estado]}
            </span>
            {pedido.total_estimado && (
              <p className="text-white font-black text-base mt-1">{pedido.total_estimado}</p>
            )}
          </div>
        </div>

        {/* Timer + acciones de edición */}
        {canEdit && (
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/8">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400 text-xs font-mono">{formatTime(msLeft)}</span>
              <span className="text-white/25 text-xs">para editar</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowEdit(true)}
                className="text-xs px-3 py-1.5 border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors font-medium">
                Editar
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="text-xs px-3 py-1.5 border border-red-900/60 text-red-400/70 hover:text-red-400 hover:border-red-700 transition-colors disabled:opacity-40">
                {deleting ? '...' : 'Eliminar'}
              </button>
            </div>
          </div>
        )}

        {/* Vista previa expandida */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-white/8">
            <div className="space-y-1 mb-3">
              {(pedido.items ?? []).map((it, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-white/70">{it.cantidad}× {it.nombre}</span>
                  <span className="text-white/40 shrink-0 ml-2">
                    {fmt(it.precio) ? `${it.cantidad > 1 ? `${fmt(it.precio)} c/u` : fmt(it.precio)}` : '—'}
                  </span>
                </div>
              ))}
            </div>
            {pedido.notas && <p className="text-white/30 text-xs italic">{pedido.notas}</p>}
          </div>
        )}

        {/* Resumen de items (collapsed) */}
        {!expanded && (
          <button onClick={() => setExpanded(true)} className="mt-2 flex flex-wrap gap-1 text-left w-full">
            {(pedido.items ?? []).slice(0, 4).map((it, i) => (
              <span key={i} className="text-xs bg-white/5 text-white/40 px-2 py-0.5">{it.cantidad}× {it.nombre}</span>
            ))}
            {(pedido.items ?? []).length > 4 && (
              <span className="text-xs text-white/25 px-1 py-0.5">+{(pedido.items ?? []).length - 4} más</span>
            )}
          </button>
        )}
      </div>
    </>
  )
}
