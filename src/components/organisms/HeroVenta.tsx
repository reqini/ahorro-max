import Link from 'next/link'
import Image from 'next/image'
import { WHATSAPP_MAYORISTA_URL } from '@/constants'

/**
 * Hero orientado a la venta minorista: lo primero que ve el consumidor final es
 * la invitación a comprar. El mayorista tiene un acceso secundario, más abajo.
 */
export function HeroVenta() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Fondo de marca */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#CC0000] to-transparent" />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] opacity-20 rounded-full blur-3xl bg-[#CC0000]" />
        <div className="absolute -bottom-40 -right-40 w-[420px] h-[420px] opacity-[0.12] rounded-full blur-3xl bg-[#F5C000]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 72px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 72px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 flex flex-col items-center text-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-2xl opacity-30 bg-[#CC0000]" />
          <Image
            src="/logo.png"
            alt="Distribuidora Ahorra Max"
            width={128}
            height={128}
            className="relative w-24 h-24 md:w-32 md:h-32 object-contain"
            priority
          />
        </div>

        <span className="text-[#F5C000] text-xs font-bold uppercase tracking-[0.25em]">
          Distribuidora en Ciudadela
        </span>

        <h1 className="text-4xl md:text-6xl font-black uppercase leading-[0.95] tracking-tight text-white">
          Los mejores precios,
          <br />
          <span className="text-[#CC0000]">directo a tu casa</span>
        </h1>

        <p className="text-white/60 text-base md:text-lg max-w-xl leading-relaxed">
          Almacén, limpieza, bebidas y más al precio de distribuidora. Armá tu pedido online y te lo
          llevamos sin cargo en la zona.
        </p>

        {/* CTA principal: comprar */}
        <div className="w-full max-w-md flex flex-col gap-3 mt-2">
          <Link
            href="/catalogo"
            className="group w-full py-5 bg-[#CC0000] hover:bg-red-700 text-white text-lg font-black uppercase tracking-wide transition-colors flex items-center justify-center gap-3 shadow-xl shadow-[#CC0000]/20"
          >
            <span>🛒 Ver productos y pedir</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <p className="text-white/35 text-xs">
            Precios actualizados · Pedido por WhatsApp · Sin mínimo de compra
          </p>
        </div>

        {/* Acceso secundario mayorista */}
        <a
          href={WHATSAPP_MAYORISTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 hover:text-[#F5C000] text-sm transition-colors border-b border-white/15 hover:border-[#F5C000] pb-0.5 mt-1"
        >
          ¿Comprás por mayor? Pedí la lista mayorista →
        </a>
      </div>
    </section>
  )
}
