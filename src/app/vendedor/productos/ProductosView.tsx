'use client'

import { useEffect, useState, useRef } from 'react'

const CACHE_KEY = 'vendedor_productos_cache'
const CACHE_TS_KEY = 'vendedor_productos_cache_ts'
const MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24h

export interface ProductoItem {
  id: string
  nombre: string
  precio_minorista: string
  precio_mayorista: string
  categoria: string
  descripcion: string
}

interface Props {
  serverProductos: ProductoItem[]
  allCount: number
  categorias: string[]
  busqueda?: string
  catFiltro?: string
}

const fmt = (p: string) => p ? (p.startsWith('$') ? p : `$${p}`) : null

function readCache(): ProductoItem[] {
  try {
    const ts = localStorage.getItem(CACHE_TS_KEY)
    if (ts && Date.now() - Number(ts) > MAX_AGE_MS) return []
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function writeCache(items: ProductoItem[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(items))
    localStorage.setItem(CACHE_TS_KEY, String(Date.now()))
  } catch {}
}

export function ProductosView({ serverProductos, allCount, categorias, busqueda, catFiltro }: Props) {
  const [productos, setProductos] = useState<ProductoItem[]>(serverProductos)
  const [totalCount, setTotalCount] = useState(allCount)
  const [fromCache, setFromCache] = useState(false)
  const bootstrapped = useRef(false)

  useEffect(() => {
    if (bootstrapped.current) return
    bootstrapped.current = true

    if (serverProductos.length > 0) {
      // We have fresh data — update cache with all (unfiltered) data not possible here,
      // so just store what we have and mark cache fresh
      writeCache(serverProductos)
      return
    }

    // Server returned empty (DB not set up or offline) — try cache
    const cached = readCache()
    if (cached.length === 0) return

    setFromCache(true)
    let filtered = cached
    if (catFiltro) filtered = filtered.filter(p => p.categoria === catFiltro)
    if (busqueda) {
      const q = busqueda.toLowerCase()
      filtered = filtered.filter(p => p.nombre.toLowerCase().includes(q) || p.descripcion?.toLowerCase().includes(q))
    }
    setProductos(filtered)
    setTotalCount(cached.length)
  }, [serverProductos, catFiltro, busqueda])

  return (
    <>
      {fromCache && (
        <div className="bg-blue-950/40 border-b border-blue-700/30 px-4 py-2 text-center">
          <p className="text-blue-300 text-xs">Mostrando datos guardados · Conectate para actualizar</p>
        </div>
      )}

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

        {categorias.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
            <a href={`/vendedor/productos${busqueda ? `?q=${busqueda}` : ''}`}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wide whitespace-nowrap border transition-colors ${!catFiltro ? 'bg-[#CC0000] border-[#CC0000] text-white' : 'border-white/20 text-white/50 hover:text-white'}`}>
              Todos ({totalCount})
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
    </>
  )
}
