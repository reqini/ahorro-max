import { getZonasEntrega } from '@/lib/zonas'
import { WHATSAPP_MINORISTA_URL } from '@/constants'

/** Zonas donde se entrega sin cargo. La lista la administra el admin. */
export async function ZonasEntrega() {
  const zonas = await getZonasEntrega()
  if (zonas.length === 0) return null

  return (
    <section className="bg-[#0a0a0a] py-14 md:py-20">
      <div className="max-w-3xl mx-auto px-5 text-center">
        <span className="text-[#F5C000] text-xs font-bold uppercase tracking-[0.25em]">
          Envío gratis
        </span>
        <h2 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tight mt-2">
          Entregamos sin cargo en tu zona
        </h2>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {zonas.map((zona) => (
            <span
              key={zona}
              className="inline-flex items-center gap-2 border border-white/15 bg-[#131313] text-white/80 text-sm px-4 py-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#CC0000]" />
              {zona}
            </span>
          ))}
        </div>

        <p className="text-white/35 text-xs mt-5">
          ¿No ves tu zona?{' '}
          <a
            href={WHATSAPP_MINORISTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-[#F5C000] underline transition-colors"
          >
            Consultanos por WhatsApp
          </a>
        </p>
      </div>
    </section>
  )
}
