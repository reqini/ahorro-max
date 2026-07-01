import { getProductos, getCategorias } from '@/lib/productos'

const fmt = (p: string) => p ? (p.startsWith('$') ? p : `$${p}`) : null

interface PageProps {
  searchParams: Promise<{ q?: string; cat?: string }>
}

export default async function VendedorProductosPage({ searchParams }: PageProps) {
  const params = await searchParams
  const busqueda = params.q
  const catFiltro = params.cat

  const [productos, categorias] = await Promise.all([
    getProductos({ categoria: catFiltro, busqueda }),
    getCategorias(),
  ])

  return (
    <div className="flex flex-col">
      {/* Search */}
      <div className="sticky top-[53px] z-30 bg-[#0d0d0d] border-b border-white/10 px-4 pt-3 pb-3 flex flex-col gap-2">
        <form method="GET" className="relative">
          <input
            name="q"
            defaultValue={busqueda}
            placeholder="Buscar producto..."
            className="w-full bg-[#1a1a1a] border border-white/20 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/35 pr-10"
          />
          {catFiltro && <input type="hidden" name="cat" value={catFiltro} />}
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">🔍</button>
        </form>

        {/* Category pills */}
        {categorias.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            <a href={`/vendedor/productos${busqueda ? `?q=${busqueda}` : ''}`}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wide whitespace-nowrap border transition-colors ${!catFiltro ? 'bg-[#CC0000] border-[#CC0000] text-white' : 'border-white/20 text-white/50 hover:text-white'}`}>
              Todos ({productos.length})
            </a>
            {categorias.map((cat) => (
              <a key={cat}
                href={`/vendedor/productos?cat=${encodeURIComponent(cat)}${busqueda ? `&q=${busqueda}` : ''}`}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wide whitespace-nowrap border transition-colors ${catFiltro === cat ? 'bg-[#CC0000] border-[#CC0000] text-white' : 'border-white/20 text-white/50 hover:text-white'}`}>
                {cat}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Product list */}
      {productos.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <p className="text-white/30 text-sm">
            {busqueda ? `Sin resultados para "${busqueda}"` : 'No hay productos cargados todavía.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {productos.map((p) => (
            <div key={p.id} className="px-4 py-3.5 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold leading-tight">{p.nombre}</p>
                {p.categoria && <p className="text-white/30 text-xs mt-0.5">{p.categoria}</p>}
                {p.descripcion && <p className="text-white/25 text-xs mt-0.5 truncate">{p.descripcion}</p>}
              </div>
              <div className="shrink-0 text-right flex items-center gap-4">
                {fmt(p.precio_minorista) && (
                  <div>
                    <p className="text-[10px] text-white/30 uppercase leading-none mb-0.5">Minorista</p>
                    <p className="text-white font-bold text-sm">{fmt(p.precio_minorista)}</p>
                  </div>
                )}
                {fmt(p.precio_mayorista) && (
                  <div>
                    <p className="text-[10px] text-[#F5C000]/50 uppercase leading-none mb-0.5">Mayorista</p>
                    <p className="text-[#F5C000] font-bold text-sm">{fmt(p.precio_mayorista)}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
