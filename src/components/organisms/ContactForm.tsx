"use client"

import { useState, useRef } from "react"
import { CONTACTO_CONTENT, WHATSAPP_NUMBER } from "@/constants"
import { Send } from "lucide-react"
import { WhatsAppIcon } from "@/components/atoms"

type Status = "idle" | "ok"

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle")
  const nombreRef = useRef<HTMLInputElement>(null)
  const telefonoRef = useRef<HTMLInputElement>(null)
  const mensajeRef = useRef<HTMLTextAreaElement>(null)
  const { labels } = CONTACTO_CONTENT

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nombre = nombreRef.current?.value ?? ""
    const telefono = telefonoRef.current?.value ?? ""
    const mensaje = mensajeRef.current?.value ?? ""

    const texto = `Hola! Mi nombre es ${nombre}, mi teléfono es ${telefono}. Consulta: ${mensaje}`
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`

    window.open(url, "_blank", "noopener,noreferrer")
    setStatus("ok")
    e.currentTarget.reset()
  }

  return (
    <section
      id="contacto"
      className="relative bg-[#0a0a0a] overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#CC0000] via-[#F5C000] to-[#CC0000]" />

      <div className="max-w-2xl mx-auto px-5 md:px-12 py-14 md:py-24">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest bg-[#CC0000] text-white mb-4">
            {CONTACTO_CONTENT.badge}
          </span>
          <h2
            className="text-[1.75rem] leading-tight sm:text-4xl md:text-5xl font-black uppercase text-white"
            style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif" }}
          >
            {CONTACTO_CONTENT.headline}
          </h2>
          <p className="mt-3 text-white/70">{CONTACTO_CONTENT.description}</p>
        </div>

        {status === "ok" ? (
          <div className="border border-[#25D366]/40 bg-[#25D366]/10 px-6 py-8 text-center">
            <p className="text-[#25D366] font-bold text-lg">{labels.exito}</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-white/50 text-sm underline hover:text-white transition-colors"
            >
              Enviar otra consulta
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-0">
              <label className="text-white/90 text-sm uppercase tracking-widest font-bold mb-2 block">
                {labels.nombre}
              </label>
              <input
                ref={nombreRef}
                type="text"
                name="nombre"
                required
                placeholder="Tu nombre completo"
                className="bg-[#242424] border border-white/25 focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000]/30 outline-none text-white px-4 py-3.5 text-base placeholder:text-white/50 transition-all"
              />
            </div>

            <div className="flex flex-col gap-0">
              <label className="text-white/90 text-sm uppercase tracking-widest font-bold mb-2 block">
                {labels.telefono}
              </label>
              <input
                ref={telefonoRef}
                type="tel"
                name="telefono"
                required
                placeholder="11 1234-5678"
                className="bg-[#242424] border border-white/25 focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000]/30 outline-none text-white px-4 py-3.5 text-base placeholder:text-white/50 transition-all"
              />
            </div>

            <div className="flex flex-col gap-0">
              <label className="text-white/90 text-sm uppercase tracking-widest font-bold mb-2 block">
                {labels.mensaje}
              </label>
              <textarea
                ref={mensajeRef}
                name="mensaje"
                required
                rows={4}
                placeholder="¿En qué te podemos ayudar?"
                className="bg-[#242424] border border-white/25 focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000]/30 outline-none text-white px-4 py-3.5 text-base placeholder:text-white/50 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-[#CC0000] hover:bg-red-700 text-white font-bold uppercase tracking-wider py-4 text-sm transition-colors mt-2"
            >
              <Send size={16} />
              <WhatsAppIcon size={16} />
              {labels.enviar}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
