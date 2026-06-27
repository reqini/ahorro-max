"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

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

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-5 py-6 text-left group cursor-pointer"
        aria-expanded={open}
      >
        {/* Number */}
        <span
          className="shrink-0 text-3xl font-black leading-none text-[#CC0000]/40 group-hover:text-[#CC0000] transition-colors duration-200 w-8 text-center"
          style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif" }}
          aria-hidden
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Question */}
        <span
          className="flex-1 text-white text-xl md:text-2xl font-black uppercase leading-tight group-hover:text-[#F5C000] transition-colors duration-200"
          style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif", letterSpacing: "0.01em" }}
        >
          {q}
        </span>

        {/* Chevron */}
        <ChevronDown
          size={22}
          className={cn(
            "shrink-0 text-[#CC0000] transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Answer */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          open ? "max-h-40 pb-6" : "max-h-0"
        )}
      >
        <p className="pl-13 text-white/70 text-base leading-relaxed" style={{ paddingLeft: "3.25rem" }}>
          {a}
        </p>
      </div>
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

      <div className="max-w-4xl mx-auto px-5 md:px-12 py-12 md:py-20">
        <div className="text-center mb-14">
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
          {FAQS.map((faq, i) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CC0000] to-transparent" />
    </section>
  )
}
