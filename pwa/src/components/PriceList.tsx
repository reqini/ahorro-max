import type { Producto } from '../types'

function formatARS(n: number): string {
  if (!n || isNaN(n)) return '—'
  return '$' + Math.round(n).toLocaleString('es-AR')
}

interface Props {
  grouped: Map<string, Producto[]>
  query: string
}

export function PriceList({ grouped, query }: Props) {
  if (grouped.size === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-white/40 text-sm">
          Sin resultados para <span className="text-white/60">"{query}"</span>
        </p>
        <p className="text-white/25 text-xs mt-1">Intentá con otro nombre o categoría</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Column headers — sticky below controls */}
      <div className="sticky top-0 z-10 flex items-center px-4 py-1.5 bg-[#0f0f0f] border-b border-white/5">
        <span className="flex-1 text-[10px] text-white/25 uppercase tracking-widest font-semibold">Producto</span>
        <span className="w-24 text-right text-[10px] text-white/25 uppercase tracking-widest font-semibold">x Pack</span>
        <span className="w-20 text-right text-[10px] text-white/25 uppercase tracking-widest font-semibold">Unitario</span>
      </div>

      {Array.from(grouped.entries()).map(([categoria, productos]) => (
        <section key={categoria}>
          {/* Category header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f0f0f] border-b border-white/5 border-t border-t-white/5 mt-1 first:mt-0">
            <span className="text-[#F97316] text-xs font-black uppercase tracking-wider">
              {categoria}
            </span>
            <span className="text-white/25 text-xs">
              {productos.length} prod.
            </span>
          </div>

          {/* Product rows */}
          <div className="divide-y divide-white/[0.04]">
            {productos.map((p, i) => (
              <div
                key={`${p.producto}-${i}`}
                className="flex items-center px-4 py-3.5 gap-2 active:bg-white/5 transition-colors"
              >
                <p className="flex-1 text-white text-sm font-medium leading-snug min-w-0 pr-2">
                  {p.producto}
                </p>
                <span className="w-24 text-right text-[#F97316] font-bold text-sm tabular flex-shrink-0">
                  {formatARS(p.precio_pack)}
                </span>
                <span className="w-20 text-right text-white/45 text-xs tabular flex-shrink-0">
                  {formatARS(p.precio_unitario)}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Bottom padding for iOS home indicator */}
      <div className="h-6" />
    </div>
  )
}
