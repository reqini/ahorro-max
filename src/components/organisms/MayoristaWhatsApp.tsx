import { WHATSAPP_MAYORISTA_URL } from '@/constants'
import { WhatsAppIcon } from '@/components/atoms/WhatsAppIcon'

const VENTAJAS = [
  'Precios por volumen imposibles de igualar',
  'Lista completa actualizada todas las semanas',
  'Entrega programada a tu comercio',
]

/**
 * Bloque mayorista, diferenciado del resto por el dorado. No muestra precios ni
 * catálogo: el mayorista pide la lista por privado, que es como trabaja el negocio.
 */
export function MayoristaWhatsApp() {
  return (
    <section id="mayorista" className="relative overflow-hidden bg-[#0a0800] py-16 md:py-24">
      {/* Acentos dorados */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 md:w-2 bg-[#F5C000]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 opacity-[0.08] rotate-45 bg-[#F5C000]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-[#F5C000]/30" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 text-center">
        <span className="inline-block border border-[#F5C000]/40 text-[#F5C000] text-xs font-bold uppercase tracking-[0.2em] px-3 py-1">
          Revendedores y comercios
        </span>

        <h2 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tight mt-5 leading-[0.95]">
          ¿Comprás por mayor?
          <br />
          <span className="text-[#F5C000]">Precios insuperables</span>
        </h2>

        <p className="text-white/55 text-base md:text-lg max-w-xl mx-auto mt-4 leading-relaxed">
          Almacenes, kioscos, maxikioscos y revendedores: pedinos la lista mayorista por WhatsApp y
          comprobá por qué somos la distribuidora de la zona.
        </p>

        <ul className="flex flex-col gap-2.5 max-w-md mx-auto mt-7 text-left">
          {VENTAJAS.map((v) => (
            <li key={v} className="flex items-start gap-3 text-white/75 text-sm">
              <span className="text-[#F5C000] font-black shrink-0 mt-0.5">✓</span>
              {v}
            </li>
          ))}
        </ul>

        <a
          href={WHATSAPP_MAYORISTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 mt-8 px-8 py-4 bg-[#F5C000] hover:bg-[#ffd400] text-black text-base font-black uppercase tracking-wide transition-colors shadow-xl shadow-[#F5C000]/15"
        >
          <WhatsAppIcon className="w-5 h-5" />
          Pedí la lista mayorista
        </a>

        <p className="text-white/30 text-xs mt-3">Te respondemos con la lista y las condiciones.</p>
      </div>
    </section>
  )
}
