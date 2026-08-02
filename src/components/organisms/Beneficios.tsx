const PILARES = [
  {
    icono: '🏷️',
    titulo: 'Precio de distribuidora',
    detalle: 'Directo, sin intermediarios. El mismo precio que consigue un comercio.',
  },
  {
    icono: '🚚',
    titulo: 'Entrega sin cargo',
    detalle: 'Te lo llevamos a tu casa o comercio en la zona, sin costo de envío.',
  },
  {
    icono: '✅',
    titulo: 'Sin mínimo de compra',
    detalle: 'Comprá lo que necesitás, poco o mucho. Armás el pedido a tu medida.',
  },
]

/** Tres razones para comprar, apenas debajo del hero. */
export function Beneficios() {
  return (
    <section className="bg-[#0d0d0d] border-y border-white/10 py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {PILARES.map((p) => (
          <div key={p.titulo} className="flex flex-col items-center text-center gap-2">
            <span className="text-4xl" aria-hidden="true">
              {p.icono}
            </span>
            <h3 className="text-white font-bold text-base uppercase tracking-wide">{p.titulo}</h3>
            <p className="text-white/45 text-sm leading-relaxed max-w-xs">{p.detalle}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
