interface Props {
  count: number
  total: number
  hasMixed: boolean
  onOpen: () => void
}

function formatARS(n: number) {
  return '$' + Math.round(n).toLocaleString('es-AR')
}

export function CartBar({ count, total, hasMixed, onOpen }: Props) {
  if (count === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 pt-2 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none">
      <button
        onClick={onOpen}
        className="w-full pointer-events-auto flex items-center justify-between px-5 py-3.5 bg-white text-black rounded-2xl shadow-2xl active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-2.5">
          {/* Cart icon */}
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          <span className="font-black text-sm">
            {count} {count === 1 ? 'producto' : 'productos'}
          </span>
          {hasMixed && (
            <span className="text-xs bg-amber-400 text-black font-black px-1.5 py-0.5 rounded-full">
              ⚠️ mixto
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-black text-base">{formatARS(total)}</span>
          <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </button>
    </div>
  )
}
