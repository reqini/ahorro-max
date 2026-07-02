import { getProductos, getCategorias } from '@/lib/productos'
import Link from 'next/link'

export const revalidate = 60

const fmt = (p: string) => p ? (p.startsWith('$') ? p : `$${p}`) : null

interface PageProps {
  searchParams: Promise<{ q?: string; cat?: string }>
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const params = await searchParams
  const busqueda = params.q
  const catFiltro = params.cat

  const [productos, todosLosProductos, categorias] = await Promise.all([
    getProductos({ categoria: catFiltro, busqueda }),
    getProductos(),
    getCategorias(),
  ])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0d0d0d] sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="text-[#CC0000] font-black text-xl tracking-tight">
            AHORRA MAX
          </Link>
          <span className="text-white/30 text-sm hidden sm:inline">Lista de precios</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">Catálogo de Precios</h1>
          <p className="text-white/40 text-sm">{todosLosProductos.length} producto{todosLosProductos.length !== 1 ? 's' : ''} disponible{todosLosProductos.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Búsqueda y filtros */}
        <div className="mb-6 flex flex-col gap-3">
          <form method="GET" className="relative">
            <input
              name="q"
              defaultValue={busqueda}
              placeholder="Buscar producto..."
              className="w-full bg-[#1a1a1a] border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/30 pr-12"
            />
            {catFiltro && <input type="hidden" name="cat" value={catFiltro} />}
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>

          {categorias.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <a href={`/catalogo${busqueda ? `?q=${busqueda}` : ''}`}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide border transition-colors ${!catFiltro ? 'bg-[#CC0000] border-[#CC0000] text-white' : 'border-white/20 text-white/50 hover:text-white'}`}>
                Todos ({todosLosProductos.length})
              </a>
              {categorias.map(cat => (
                <a key={cat}
                  href={`/catalogo?cat=${encodeURIComponent(cat)}${busqueda ? `&q=${busqueda}` : ''}`}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide border transition-colors ${catFiltro === cat ? 'bg-[#CC0000] border-[#CC0000] text-white' : 'border-white/20 text-white/50 hover:text-white'}`}>
                  {cat}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Lista de productos */}
        {productos.length === 0 ? (
          <div className="border border-white/10 py-16 text-center">
            <p className="text-white/30 text-sm">
              {busqueda ? `Sin resultados para "${busqueda}"` : 'No hay productos cargados todavía.'}
            </p>
          </div>
        ) : (
          <div className="border border-white/10 divide-y divide-white/5">
            {/* Encabezado tabla */}
            <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2 bg-white/5">
              <span className="text-white/30 text-xs uppercase tracking-wide">Producto</span>
              <span className="text-white/30 text-xs uppercase tracking-wide text-right">Minorista</span>
              <span className="text-[#F5C000]/50 text-xs uppercase tracking-wide text-right">Mayorista</span>
            </div>

            {productos.map(p => (
              <div key={p.id} className="px-4 py-4 flex items-center gap-3 hover:bg-white/3 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight">{p.nombre}</p>
                  {p.categoria && <p className="text-white/30 text-xs mt-0.5">{p.categoria}</p>}
                  {p.descripcion && <p className="text-white/20 text-xs mt-0.5 truncate">{p.descripcion}</p>}
                </div>
                <div className="shrink-0 flex items-center gap-6">
                  {fmt(p.precio_minorista) ? (
                    <div className="text-right">
                      <p className="text-[10px] text-white/30 uppercase leading-none mb-0.5 hidden sm:block">Minorista</p>
                      <p className="text-white font-bold text-base">{fmt(p.precio_minorista)}</p>
                    </div>
                  ) : <div className="w-16" />}
                  {fmt(p.precio_mayorista) ? (
                    <div className="text-right min-w-[64px]">
                      <p className="text-[10px] text-[#F5C000]/50 uppercase leading-none mb-0.5 hidden sm:block">Mayorista</p>
                      <p className="text-[#F5C000] font-bold text-base">{fmt(p.precio_mayorista)}</p>
                    </div>
                  ) : <div className="w-16" />}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-white/20 text-xs text-center mt-8">
          Precios sujetos a cambio sin previo aviso · Consultá disponibilidad
        </p>
      </div>
    </div>
  )
}
