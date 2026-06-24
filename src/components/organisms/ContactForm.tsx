"use client"

import { useState } from "react"
import { CONTACTO_CONTENT, WHATSAPP_MINORISTA_URL } from "@/constants"
import { Send } from "lucide-react"
import { WhatsAppIcon } from "@/components/atoms"

// Reemplazar con el form ID de Formspree: https://formspree.io
const FORMSPREE_ENDPOINT = "https://formspree.io/f/REEMPLAZAR_CON_ID"

type Status = "idle" | "sending" | "ok" | "error"

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle")
  const { labels } = CONTACTO_CONTENT

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    const form = e.currentTarget
    const data = new FormData(form)
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
      if (res.ok) {
        setStatus("ok")
        form.reset()
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <section
      id="contacto"
      className="relative bg-[#0a0a0a] overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#CC0000] via-[#F5C000] to-[#CC0000]" />

      <div className="max-w-2xl mx-auto px-5 md:px-12 py-14 md:py-24">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest bg-[#CC0000] text-white mb-4">
            {CONTACTO_CONTENT.badge}
          </span>
          <h2
            className="text-4xl md:text-5xl font-black uppercase text-white leading-none"
            style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif" }}
          >
            {CONTACTO_CONTENT.headline}
          </h2>
          <p className="mt-3 text-white/70">{CONTACTO_CONTENT.description}</p>
        </div>

        {status === "ok" ? (
          <div className="border border-[#25D366]/40 bg-[#25D366]/10 px-6 py-8 text-center">
            <p className="text-[#25D366] font-bold text-lg">{labels.exito}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-white/60 text-xs uppercase tracking-wider font-semibold">
                {labels.nombre}
              </label>
              <input
                type="text"
                name="nombre"
                required
                placeholder="Tu nombre completo"
                className="bg-[#111] border border-white/10 focus:border-[#CC0000] outline-none text-white px-4 py-3 text-sm placeholder:text-white/30 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white/60 text-xs uppercase tracking-wider font-semibold">
                {labels.telefono}
              </label>
              <input
                type="tel"
                name="telefono"
                required
                placeholder="11 1234-5678"
                className="bg-[#111] border border-white/10 focus:border-[#CC0000] outline-none text-white px-4 py-3 text-sm placeholder:text-white/30 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white/60 text-xs uppercase tracking-wider font-semibold">
                {labels.mensaje}
              </label>
              <textarea
                name="mensaje"
                required
                rows={4}
                placeholder="¿En qué te podemos ayudar?"
                className="bg-[#111] border border-white/10 focus:border-[#CC0000] outline-none text-white px-4 py-3 text-sm placeholder:text-white/30 transition-colors resize-none"
              />
            </div>

            {status === "error" && (
              <div className="border border-[#CC0000]/40 bg-[#CC0000]/10 px-4 py-3">
                <p className="text-[#CC0000] text-sm">{labels.error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="flex items-center justify-center gap-2 flex-1 bg-[#CC0000] hover:bg-red-700 disabled:opacity-60 text-white font-bold uppercase tracking-wider py-4 text-sm transition-colors"
              >
                <Send size={16} />
                {status === "sending" ? labels.enviando : labels.enviar}
              </button>

              <a
                href={WHATSAPP_MINORISTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 flex-1 border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 font-bold uppercase tracking-wider py-4 text-sm transition-colors"
              >
                <WhatsAppIcon size={16} />
                WhatsApp
              </a>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
