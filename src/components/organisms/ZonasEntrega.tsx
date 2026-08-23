import { getZonasDetalle } from '@/lib/zonas'
import { getContactInfo } from '@/lib/whatsapp'

/** Zonas de reparto sin cargo, agrupadas por región y día. Editable desde /admin/zonas. */
export async function ZonasEntrega() {
  const [zonas, { minorista: whatsappMinoristaUrl }] = await Promise.all([getZonasDetalle(), getContactInfo()])

  return (
    <section className="bg-[#0a0a0a] py-14 md:py-20">
      <div className="max-w-4xl mx-auto px-5 text-center">
        <span className="text-[#F5C000] text-xs font-bold uppercase tracking-[0.25em]">
          Envío gratis
        </span>
        <h2 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tight mt-2">
          Entregamos sin cargo en tu zona
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8 text-left">
          {zonas.map((z) => (
            <div key={z.region} className="border border-white/15 bg-[#131313] p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-white font-black text-base uppercase tracking-wide">{z.region}</h3>
                <span className="text-[#F5C000] text-xs font-bold uppercase tracking-wide shrink-0">
                  {z.dias}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {z.barrios.map((barrio) => (
                  <span
                    key={barrio}
                    className="inline-flex items-center gap-1.5 border border-white/15 bg-[#1a1a1a] text-white/75 text-xs px-3 py-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CC0000]" />
                    {barrio}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-white/35 text-xs mt-6">
          ¿No ves tu zona?{' '}
          <a
            href={whatsappMinoristaUrl}
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
