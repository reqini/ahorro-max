interface Props {
  value: string
  onChange: (v: string) => void
  resultCount: number
  totalCount: number
}

export function SearchBar({ value, onChange, resultCount, totalCount }: Props) {
  return (
    <div className="px-4 py-2.5">
      <div className="relative">
        {/* Search icon */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>

        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar producto o categoría..."
          className="w-full h-11 bg-[#141414] border border-white/10 rounded-xl pl-9 pr-4 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#F97316]/60 transition-colors"
        />

        {/* Clear button */}
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Result count hint */}
      {value && (
        <p className="text-white/30 text-xs mt-1.5 pl-1">
          {resultCount === 0
            ? 'Sin resultados'
            : `${resultCount} de ${totalCount} producto${resultCount !== 1 ? 's' : ''}`}
        </p>
      )}
    </div>
  )
}
