import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const FAQS = [
  {
    q: "¿Dónde están ubicados?",
    a: "En 25 de mayo 108, Ciudadela, CP 1702 — Partido de Tres de Febrero, zona oeste del Gran Buenos Aires.",
  },
  {
    q: "¿Venden al por mayor y al por menor?",
    a: "Sí. Atendemos a consumidores finales sin mínimo de compra y a revendedores, almacenes y kioscos con precios por volumen.",
  },
  {
    q: "¿Cuál es el WhatsApp?",
    a: "+54 11 5020-3114. Podés escribirnos para consultar precios, catálogo y disponibilidad de stock.",
  },
  {
    q: "¿Qué productos tienen?",
    a: "Productos de consumo masivo: alimentos secos, bebidas, limpieza, higiene personal y del hogar.",
  },
  {
    q: "¿Cuáles son los horarios?",
    a: "Lunes a Viernes de 8:00 a 18:00 hs. Sábados de 8:00 a 13:00 hs. Domingos cerrado.",
  },
  {
    q: "¿Tienen lista de precios mayoristas?",
    a: "Sí, tenemos catálogo descargable en esta página. También podés pedirla por WhatsApp.",
  },
]

interface FAQItemProps {
  q: string
  a: string
  className?: string
}

function FAQItem({ q, a, className }: FAQItemProps) {
  return (
    <div
      className={cn(
        "border-b border-white/10 last:border-0 py-5 group",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h3
          className="text-white font-bold text-lg leading-snug"
          style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif" }}
        >
          {q}
        </h3>
        <ChevronDown className="text-[#CC0000] shrink-0 mt-1" size={20} />
      </div>
      <p className="mt-3 text-white/90 leading-relaxed text-base">{a}</p>
    </div>
  )
}

export function FAQSection() {
  return (
    <section
      id="faq"
      className="relative bg-[#080808] overflow-hidden"
      aria-label="Preguntas frecuentes"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CC0000] to-transparent" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-20">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest bg-[#CC0000] text-white mb-4">
            FAQ
          </span>
          <h2
            className="text-4xl md:text-5xl font-black uppercase text-white leading-none"
            style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif" }}
          >
            Preguntas Frecuentes
          </h2>
        </div>

        <div>
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CC0000] to-transparent" />
    </section>
  )
}
