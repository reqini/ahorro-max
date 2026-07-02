import { useMemo, useState } from 'react'
import Papa from 'papaparse'
import rawCsv from './data/lista_precios_ahorra_max_julio2026.csv?raw'
import { Header } from './components/Header'
import { TabBar } from './components/TabBar'
import { SearchBar } from './components/SearchBar'
import { CategoryFilter } from './components/CategoryFilter'
import { PriceList } from './components/PriceList'
import { CartBar } from './components/CartBar'
import { CartDrawer } from './components/CartDrawer'
import { useCart } from './hooks/useCart'
import type { Producto, TipoPrecio } from './types'

const { data: ALL_PRODUCTOS } = Papa.parse<Producto>(rawCsv.trim(), {
  header: true,
  skipEmptyLines: true,
  dynamicTyping: true,
})

export default function App() {
  const [tipoPrecio, setTipoPrecio] = useState<TipoPrecio>('minorista')
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [cartOpen, setCartOpen] = useState(false)

  const cart = useCart()

  const categories = useMemo(() => {
    const cats = [...new Set(ALL_PRODUCTOS.map((p) => p.categoria).filter(Boolean))]
    return ['Todos', ...cats]
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ALL_PRODUCTOS.filter((p) => {
      if (!p.categoria || !p.producto) return false
      const matchesQuery =
        !q ||
        p.producto.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
      const matchesCat = selectedCategory === 'Todos' || p.categoria === selectedCategory
      return matchesQuery && matchesCat
    })
  }, [query, selectedCategory])

  const grouped = useMemo(() => {
    const map = new Map<string, Producto[]>()
    for (const p of filtered) {
      if (!map.has(p.categoria)) map.set(p.categoria, [])
      map.get(p.categoria)!.push(p)
    }
    return map
  }, [filtered])

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat)
    setQuery('')
  }

  const handleTabChange = (tipo: TipoPrecio) => {
    setTipoPrecio(tipo)
    setQuery('')
    setSelectedCategory('Todos')
  }

  const minoristaCount = cart.minoristaItems.reduce((s, i) => s + i.cantidad, 0)
  const mayoristaCount = cart.mayoristaItems.reduce((s, i) => s + i.cantidad, 0)

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      <Header totalProducts={ALL_PRODUCTOS.length} />

      {/* Tabs + sticky controls */}
      <div className="sticky top-14 z-20 bg-[#0a0a0a] shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
        <TabBar
          active={tipoPrecio}
          onChange={handleTabChange}
          cartCountMinorista={minoristaCount}
          cartCountMayorista={mayoristaCount}
        />
        <SearchBar
          value={query}
          onChange={(v) => {
            setQuery(v)
            if (v) setSelectedCategory('Todos')
          }}
          resultCount={filtered.length}
          totalCount={ALL_PRODUCTOS.length}
        />
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={handleCategorySelect}
        />
      </div>

      <PriceList
        grouped={grouped}
        query={query}
        tipoPrecio={tipoPrecio}
        getQty={cart.getQty}
        onAdd={(producto) => cart.add(producto, tipoPrecio)}
        hasCartItems={cart.count > 0}
      />

      <CartBar
        count={cart.count}
        total={cart.total}
        hasMixed={cart.hasMixed}
        onOpen={() => setCartOpen(true)}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        minoristaItems={cart.minoristaItems}
        mayoristaItems={cart.mayoristaItems}
        total={cart.total}
        hasMixed={cart.hasMixed}
        onQtyChange={cart.setQty}
        onClear={cart.clear}
        buildResumen={cart.buildResumen}
      />
    </div>
  )
}
