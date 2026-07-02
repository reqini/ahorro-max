import type { Producto, TipoPrecio } from '../types'

function formatARS(n: number): string {
  if (!n || isNaN(n)) return '—'
  return '$' + Math.round(n).toLocaleString('es-AR')
}

interface Props {
  grouped: Map<string, Producto[]>
  query: string
  tipoPrecio: TipoPrecio
  getQty: (nombre: string, tipo: TipoPrecio) => number
  onAdd: (producto: Producto) => void
  hasCartItems: boolean
}

export function PriceList({ grouped, query, tipoPrecio, getQty, onAdd, hasCartItems }: Props) {
  const isMinorista = tipoPrecio === 'minorista'
  const accentColor = isMinorista ? '#CC0000' : '#F5C000'
  const priceTextClass = isMinorista ? 'text-[#FF4444]' : 'text-[#F5C000]'
  const btnBorderClass = isMinorista ? 'border-[#CC0000] text-[#CC0000]' : 'border-[#F5C000] text-[#F5C000]'
  const btnFilledClass = isMinorista ? 'bg-[#CC0000] text-white' : 'bg-[#F5C000] text-black'

  if (grouped.size === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 px-8 text-center ${hasCartItems ? 'mb-20' : ''}`}>
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-white/40 text-sm">
          Sin resultados{query ? <> para <span className="text-white/60">"{query}"</span></> : null}
        </p>
        <p className="text-white/25 text-xs mt-1">Intentá con otro nombre o categoría</p>
      </div>
    )
  }

  return (
    <div className={`flex-1 overflow-y-auto ${hasCartItems ? 'pb-24' : 'pb-6'}`}>
      {/* Column headers */}
      <div className="sticky top-0 z-10 flex items-center px-4 py-1.5 bg-[#0f0f0f] border-b border-white/5">
        <span className="flex-1 text-[10px] text-white/25 uppercase tracking-widest font-semibold">
          Producto
        </span>
        <span className="w-28 text-right text-[10px] uppercase tracking-widest font-semibold" style={{ color: accentColor, opacity: 0.7 }}>
          {isMinorista ? 'Precio unit.' : 'Precio x pack'}
        </span>
        <span className="w-8 flex-shrink-0" />
      </div>

      {Array.from(grouped.entries()).map(([categoria, productos]) => (
        <section key={categoria}>
          {/* Category header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f0f0f] border-b border-white/5 border-t border-t-white/5 mt-1 first:mt-0">
            <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: accentColor }}>
              {categoria}
            </span>
            <span className="text-white/25 text-[10px]">{productos.length} prod.</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/[0.04]">
            {productos.map((p) => {
              const precio = isMinorista ? p.precio_minorista : p.precio_mayorista
              const qty = getQty(p.producto, tipoPrecio)
              const inCart = qty > 0

              return (
                <div
                  key={p.producto}
                  className="flex items-center px-4 py-3 gap-2"
                >
                  {/* Product name */}
                  <p className="flex-1 text-white text-sm font-medium leading-snug min-w-0">
                    {p.producto}
                  </p>

                  {/* Price */}
                  <span className={`w-28 text-right font-bold text-sm tabular flex-shrink-0 ${priceTextClass}`}>
                    {formatARS(precio)}
                  </span>

                  {/* Add button */}
                  <button
                    onClick={() => onAdd(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border font-black text-xs flex-shrink-0 transition-all active:scale-90 ${
                      inCart ? btnFilledClass : `${btnBorderClass} bg-transparent`
                    }`}
                    aria-label={inCart ? `${qty} en carrito — agregar más` : 'Agregar al carrito'}
                  >
                    {inCart ? qty : '+'}
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
