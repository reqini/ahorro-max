import { useMemo, useState } from 'react'
import Papa from 'papaparse'
import rawCsv from './data/lista_precios_ahorra_max_julio2026.csv?raw'
import { Header } from './components/Header'
import { SearchBar } from './components/SearchBar'
import { CategoryFilter } from './components/CategoryFilter'
import { PriceList } from './components/PriceList'
import type { Producto } from './types'

const { data: ALL_PRODUCTOS } = Papa.parse<Producto>(rawCsv.trim(), {
  header: true,
  skipEmptyLines: true,
  dynamicTyping: true,
})

export default function App() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')

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

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      <Header totalProducts={ALL_PRODUCTOS.length} />

      {/* Sticky controls */}
      <div className="sticky top-14 z-20 bg-[#0a0a0a] border-b border-white/8 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
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

      <PriceList grouped={grouped} query={query} />
    </div>
  )
}
