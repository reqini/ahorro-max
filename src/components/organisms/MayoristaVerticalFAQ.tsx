import { JsonLd } from '@/components/atoms/JsonLd'
import { buildFaqPageSchema } from '@/lib/schema'
import { FAQList } from './FAQList'
import type { FaqItem } from '@/lib/faqs'

interface Props {
  faqs: FaqItem[]
  /** Ruta de la página donde se renderiza, para el @id del schema. */
  pageUrl: string
}

/** FAQ propio de una landing "mayorista para X" — no usa las FAQs generales de /admin/faqs. */
export function MayoristaVerticalFAQ({ faqs, pageUrl }: Props) {
  return (
    <section className="relative bg-[#080808] overflow-hidden" aria-label="Preguntas frecuentes">
      <JsonLd data={buildFaqPageSchema(faqs, pageUrl)} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CC0000] to-transparent" />

      <div className="max-w-4xl mx-auto px-5 md:px-12 py-12 md:py-20">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest bg-[#CC0000] text-white mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">Preguntas Frecuentes</h2>
        </div>

        <FAQList faqs={faqs} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CC0000] to-transparent" />
    </section>
  )
}
