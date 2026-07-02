import { useState } from 'react'
import type { CartItem } from '../types'

function formatARS(n: number) {
  return '$' + Math.round(n).toLocaleString('es-AR')
}

interface Props {
  open: boolean
  onClose: () => void
  minoristaItems: CartItem[]
  mayoristaItems: CartItem[]
  total: number
  hasMixed: boolean
  onQtyChange: (id: string, qty: number) => void
  onClear: () => void
  buildResumen: () => string
}

export function CartDrawer({
  open,
  onClose,
  minoristaItems,
  mayoristaItems,
  total,
  hasMixed,
  onQtyChange,
  onClear,
  buildResumen,
}: Props) {
  const [copied, setCopied] = useState(false)

  const allItems = [...minoristaItems, ...mayoristaItems]
  const count = allItems.reduce((s, i) => s + i.cantidad, 0)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildResumen())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: create a textarea and copy
      const ta = document.createElement('textarea')
      ta.value = buildResumen()
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleClear() {
    if (window.confirm('¿Limpiar todo el carrito?')) {
      onClear()
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-[#111] rounded-t-2xl transition-transform duration-300 max-h-[85vh] flex flex-col ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxWidth: '640px', margin: '0 auto' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-white/15 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 flex-shrink-0">
          <div>
            <h2 className="text-white font-black text-base">
              Carrito
              <span className="text-white/35 font-normal text-sm ml-2">
                {count} {count === 1 ? 'producto' : 'productos'}
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Warning */}
        {hasMixed && (
          <div className="mx-4 mt-3 flex-shrink-0 flex items-start gap-2.5 bg-amber-950/40 border border-amber-700/40 rounded-xl px-4 py-3">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <div>
              <p className="text-amber-400 font-bold text-sm">Precios mixtos detectados</p>
              <p className="text-amber-400/70 text-xs mt-0.5">
                Tenés productos minoristas y mayoristas en el mismo carrito. Revisá antes de cotizar.
              </p>
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-2 space-y-4">
          {minoristaItems.length > 0 && (
            <ItemGroup
              label="Lista Minorista"
              color="text-[#FF4444]"
              borderColor="border-[#CC0000]/30"
              items={minoristaItems}
              onQtyChange={onQtyChange}
            />
          )}
          {mayoristaItems.length > 0 && (
            <ItemGroup
              label="Lista Mayorista"
              color="text-[#F5C000]"
              borderColor="border-[#F5C000]/30"
              items={mayoristaItems}
              onQtyChange={onQtyChange}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-white/8 px-5 py-4 space-y-3">
          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-sm">Total</span>
            <span className="text-white font-black text-2xl">{formatARS(total)}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="flex-1 h-11 border border-white/10 text-white/40 hover:text-white hover:border-white/25 text-sm rounded-xl transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={handleCopy}
              className={`flex-[2] h-11 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-black hover:bg-white/90 active:scale-[0.98]'
              }`}
            >
              {copied ? (
                <>✓ Copiado</>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                  </svg>
                  Copiar resumen
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

interface ItemGroupProps {
  label: string
  color: string
  borderColor: string
  items: CartItem[]
  onQtyChange: (id: string, qty: number) => void
}

function ItemGroup({ label, color, borderColor, items, onQtyChange }: ItemGroupProps) {
  const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0)

  return (
    <div className={`border ${borderColor} rounded-xl overflow-hidden`}>
      {/* Group header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03]">
        <span className={`text-xs font-black uppercase tracking-wider ${color}`}>{label}</span>
        <span className="text-white/35 text-xs font-semibold">{formatARS(subtotal)}</span>
      </div>

      {/* Items */}
      <div className="divide-y divide-white/5">
        {items.map((item) => (
          <div key={item.id} className="flex items-center px-4 py-3 gap-3">
            {/* Qty controls */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => onQtyChange(item.id, item.cantidad - 1)}
                className="w-7 h-7 flex items-center justify-center border border-white/15 text-white/60 hover:text-white rounded-lg text-base transition-colors"
              >
                −
              </button>
              <span className="w-6 text-center text-white font-bold text-sm tabular">
                {item.cantidad}
              </span>
              <button
                onClick={() => onQtyChange(item.id, item.cantidad + 1)}
                className="w-7 h-7 flex items-center justify-center border border-white/15 text-white/60 hover:text-white rounded-lg text-base transition-colors"
              >
                +
              </button>
            </div>

            {/* Name */}
            <p className="flex-1 text-white text-sm leading-snug min-w-0 truncate">
              {item.nombre}
            </p>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <p className="text-white font-bold text-sm tabular">
                {formatARS(item.precio * item.cantidad)}
              </p>
              {item.cantidad > 1 && (
                <p className="text-white/30 text-[10px] tabular">
                  {formatARS(item.precio)} c/u
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
