'use client'

import { useState, type FormEvent } from 'react'
import { WHATSAPP_NUMBER, MAYORISTA_MIN_MONTO } from '@/constants'
import { WhatsAppIcon } from '@/components/atoms/WhatsAppIcon'

interface Props {
  /** Número de WhatsApp; por defecto el fijo del código. Pasalo desde un componente que ya haya leído /admin/config. */
  numero?: string
  /** Mínimo de compra mayorista a mostrar; por defecto el fijo del código. Pasalo desde /admin/zonas. */
  minimoMonto?: string
}

const VENTAJAS = [
  'Precios por volumen imposibles de igualar',
  'Lista completa actualizada todas las semanas',
  'Entrega programada a tu comercio',
]

const TIPOS_COMERCIO = ['Almacén', 'Kiosco', 'Supermercado', 'Restaurante', 'Otro']

const inputClass =
  'w-full bg-[#1a1a1a] border border-white/30 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#F5C000] transition-colors placeholder-white/45'

/**
 * Bloque mayorista, diferenciado del resto por el dorado. No muestra precios ni
 * catálogo: antes de ir a WhatsApp, pedimos nombre/tipo de comercio/zona para
 * llegar con el mensaje ya calificado.
 */
export function MayoristaWhatsApp({ numero = WHATSAPP_NUMBER, minimoMonto = MAYORISTA_MIN_MONTO }: Props = {}) {
  const [nombre, setNombre] = useState('')
  const [tipoComercio, setTipoComercio] = useState('')
  const [zona, setZona] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const msg = `Hola! Soy ${nombre}, tengo un/a ${tipoComercio} en ${zona} y quiero pedir la lista de precios mayoristas (mínimo ${minimoMonto} por pedido) 📦`
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
  }

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

        <p className="text-[#F5C000] font-bold text-sm md:text-base mt-3">
          Precios mayoristas en pedidos desde {minimoMonto}
        </p>

        <ul className="flex flex-col gap-2.5 max-w-md mx-auto mt-7 text-left">
          {VENTAJAS.map((v) => (
            <li key={v} className="flex items-start gap-3 text-white/75 text-sm">
              <span className="text-[#F5C000] font-black shrink-0 mt-0.5">✓</span>
              {v}
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto mt-8 text-left">
          <input
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            className={inputClass}
          />
          <select
            required
            value={tipoComercio}
            onChange={(e) => setTipoComercio(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Tipo de comercio
            </option>
            {TIPOS_COMERCIO.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            required
            value={zona}
            onChange={(e) => setZona(e.target.value)}
            placeholder="Zona (ej: Ciudadela, Villa Devoto...)"
            className={inputClass}
          />

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-3 mt-2 px-8 py-4 bg-[#F5C000] hover:bg-[#ffd400] text-black text-base font-black uppercase tracking-wide transition-colors shadow-xl shadow-[#F5C000]/15"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Pedí la lista mayorista
          </button>
        </form>

        <p className="text-white/30 text-xs mt-3">Te respondemos con la lista y las condiciones.</p>
      </div>
    </section>
  )
}
