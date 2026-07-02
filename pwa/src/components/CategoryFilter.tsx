interface Props {
  categories: string[]
  selected: string
  onSelect: (cat: string) => void
}

export function CategoryFilter({ categories, selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 px-4 pb-2.5 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
      {categories.map((cat) => {
        const active = cat === selected
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`flex-shrink-0 h-8 px-3.5 rounded-full text-xs font-semibold border transition-all active:scale-95 whitespace-nowrap ${
              active
                ? 'bg-[#F97316] border-[#F97316] text-white'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/25'
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
