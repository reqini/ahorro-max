import { OFERTAS_CONTENT, WHATSAPP_MINORISTA_URL, WHATSAPP_MAYORISTA_URL } from "@/constants"
import { WhatsAppIcon } from "@/components/atoms"
import { Tag } from "lucide-react"

export function OfertasSection() {
  const { minorista, mayorista } = OFERTAS_CONTENT

  return (
    <section
      id="ofertas"
      className="relative bg-[#060606] overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#CC0000] via-[#F5C000] to-[#CC0000]" />

      <div className="max-w-7xl mx-auto px-5 md:px-12 py-14 md:py-24">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest bg-[#F5C000] text-black mb-4">
            {OFERTAS_CONTENT.badge}
          </span>
          <h2
            className="text-4xl md:text-5xl font-black uppercase text-white leading-none"
            style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif" }}
          >
            {OFERTAS_CONTENT.headline}
          </h2>
          <p className="mt-3 text-white/70 max-w-xl mx-auto">{OFERTAS_CONTENT.description}</p>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Minorista */}
          <div className="border border-[#CC0000]/40 bg-black/40">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[#CC0000]/30 bg-[#CC0000]/10">
              <Tag size={18} className="text-[#CC0000]" />
              <span
                className="text-[#CC0000] font-black uppercase tracking-wider text-sm"
                style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif" }}
              >
                {minorista.label}
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {minorista.items.map((item) => (
                <div key={item.nombre} className="flex items-center justify-between px-6 py-4 gap-4">
                  <div>
                    <p className="text-white font-semibold text-sm">{item.nombre}</p>
                    <p className="text-white/50 text-xs mt-0.5">{item.detalle}</p>
                  </div>
                  <span className="text-[#CC0000] font-black text-sm whitespace-nowrap">{item.precio}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-[#CC0000]/20">
              <a
                href={WHATSAPP_MINORISTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#CC0000] hover:bg-red-700 text-white font-bold uppercase tracking-wider py-3 text-sm transition-colors"
              >
                <WhatsAppIcon size={16} />
                Consultar precios
              </a>
            </div>
          </div>

          {/* Mayorista */}
          <div className="border border-[#F5C000]/40 bg-black/40">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F5C000]/30 bg-[#F5C000]/10">
              <Tag size={18} className="text-[#F5C000]" />
              <span
                className="text-[#F5C000] font-black uppercase tracking-wider text-sm"
                style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif" }}
              >
                {mayorista.label}
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {mayorista.items.map((item) => (
                <div key={item.nombre} className="flex items-center justify-between px-6 py-4 gap-4">
                  <div>
                    <p className="text-white font-semibold text-sm">{item.nombre}</p>
                    <p className="text-white/50 text-xs mt-0.5">{item.detalle}</p>
                  </div>
                  <span className="text-[#F5C000] font-black text-sm whitespace-nowrap">{item.precio}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-[#F5C000]/20">
              <a
                href={WHATSAPP_MAYORISTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#F5C000] hover:bg-yellow-400 text-black font-bold uppercase tracking-wider py-3 text-sm transition-colors"
              >
                <WhatsAppIcon size={16} />
                Consultar precios
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">{OFERTAS_CONTENT.nota}</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F5C000] to-transparent" />
    </section>
  )
}
