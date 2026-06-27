// Animated product background ticker for the Hero section.
// Remove the <ProductTicker /> line in Hero.tsx to disable it completely.

const ROW_1 = [
  { emoji: "🧃", label: "Jugos" },
  { emoji: "🥤", label: "Bebidas" },
  { emoji: "🍫", label: "Chocolates" },
  { emoji: "🍬", label: "Golosinas" },
  { emoji: "🍭", label: "Caramelos" },
  { emoji: "🥫", label: "Conservas" },
  { emoji: "🍪", label: "Galletitas" },
  { emoji: "🧁", label: "Alfajores" },
  { emoji: "🧋", label: "Lácteos" },
  { emoji: "🍿", label: "Snacks" },
]

const ROW_2 = [
  { emoji: "🧴", label: "Higiene" },
  { emoji: "🧹", label: "Limpieza" },
  { emoji: "🧻", label: "Papel" },
  { emoji: "🧺", label: "Hogar" },
  { emoji: "🫧", label: "Detergente" },
  { emoji: "🪥", label: "Cuidado personal" },
  { emoji: "🧼", label: "Jabón" },
  { emoji: "🪣", label: "Limpiadores" },
  { emoji: "🫙", label: "Aceites" },
  { emoji: "🌾", label: "Harinas" },
]

function TickerItem({ emoji, label }: { emoji: string; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 mx-4 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap select-none"
      style={{
        background: "var(--th-chip-bg)",
        border: "1px solid var(--th-chip-border)",
        color: "var(--th-chip-text)",
      }}
    >
      <span className="text-base leading-none">{emoji}</span>
      {label}
    </span>
  )
}

function TickerRow({
  items,
  direction,
}: {
  items: typeof ROW_1
  direction: "left" | "right"
}) {
  // Duplicate for seamless loop
  const doubled = [...items, ...items]
  return (
    <div
      className="overflow-hidden w-full"
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div className={direction === "left" ? "ticker-left" : "ticker-right"} style={{ display: "flex", width: "max-content" }}>
        {doubled.map((item, i) => (
          <TickerItem key={`${item.label}-${i}`} emoji={item.emoji} label={item.label} />
        ))}
      </div>
    </div>
  )
}

export function ProductTicker() {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between py-24 pointer-events-none"
      aria-hidden="true"
    >
      {/* Gradiente radial central para que los chips no compitan con el contenido */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 65% at 50% 50%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 50%, transparent 100%)",
        }}
      />

      {/* Fila superior — izquierda */}
      <div className="relative z-0">
        <TickerRow items={ROW_1} direction="left" />
      </div>

      {/* Fila del medio — derecha */}
      <div className="relative z-0">
        <TickerRow items={ROW_2} direction="right" />
      </div>

      {/* Fila inferior — solo desktop */}
      <div className="relative z-0 hidden md:block">
        <TickerRow items={[...ROW_1].reverse()} direction="left" />
      </div>
    </div>
  )
}
