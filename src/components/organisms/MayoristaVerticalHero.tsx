import { Badge, Button, WhatsAppIcon } from '@/components/atoms'
import { FeatureList } from '@/components/molecules'
import { MAYORISTA_MIN_MONTO } from '@/constants'
import type { MayoristaVertical } from '@/constants/mayoristaVerticals'

/** Hero de una landing "mayorista para X": mismo tratamiento dorado que la sección mayorista del home, con contenido propio de cada vertical. */
export function MayoristaVerticalHero({ vertical }: { vertical: MayoristaVertical }) {
  return (
    <section className="relative bg-[#0a0800] overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 md:w-2 bg-[#F5C000]" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-5"
          style={{ background: 'linear-gradient(to left, #F5C000 0%, transparent 100%)' }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-[#F5C000]/30" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-12 py-14 md:py-24">
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-3 md:gap-4">
            <Badge variant="yellow">{vertical.badge}</Badge>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tight text-white">
              {vertical.h1}
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
              {vertical.description}
            </p>
          </div>

          <FeatureList items={vertical.puntos} iconColor="text-[#F5C000]" />

          <div className="flex flex-wrap gap-2">
            {vertical.categoriasDestacadas.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 border border-[#F5C000]/30 bg-[#F5C000]/5 text-[#F5C000] text-xs font-bold uppercase tracking-wide px-3 py-1.5"
              >
                {cat}
              </span>
            ))}
          </div>

          <p className="text-[#F5C000] font-bold text-sm md:text-base">
            Precios mayoristas en pedidos desde {MAYORISTA_MIN_MONTO}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button as="a" href={vertical.whatsappUrl} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg" fullWidth className="sm:w-auto">
              <WhatsAppIcon size={18} />
              Consultar precios por WhatsApp
            </Button>
            <Button as="a" href="/catalogo" variant="outline" size="lg" fullWidth className="sm:w-auto">
              Ver catálogo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
