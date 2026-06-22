import { SectionHeader, CTAGroup, FeatureList } from "@/components/molecules"
import {
  MAYORISTA_CONTENT,
  WHATSAPP_MAYORISTA_URL,
  LISTA_MAYORISTA_URL,
} from "@/constants"

export function SectionMayorista() {
  return (
    <section
      id="mayorista"
      className="relative flex items-center bg-[#0a0800] overflow-hidden"
    >
      {/* Yellow accent left bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 md:w-2 bg-[#F5C000]" />

      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-5"
          style={{ background: "linear-gradient(to left, #F5C000 0%, transparent 100%)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 opacity-10 rotate-45"
          style={{ background: "#F5C000" }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-[#F5C000]/30" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#F5C000]/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-12 py-14 md:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Visual block — desktop only */}
          <div className="hidden lg:flex items-center justify-center order-last lg:order-first">
            <div className="relative">
              <div className="w-72 h-72 border-4 border-[#F5C000] flex items-center justify-center">
                <div className="text-center px-8">
                  <div
                    className="text-5xl font-black text-[#F5C000] leading-none uppercase"
                    style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif" }}
                  >Mayor</div>
                  <div
                    className="text-5xl font-black text-[#F5C000] leading-none uppercase"
                    style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif" }}
                  >ista</div>
                  <div className="w-16 h-1 bg-[#F5C000] mx-auto my-3" />
                  <div
                    className="text-2xl font-black text-white uppercase"
                    style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif" }}
                  >Precios que convienen</div>
                </div>
              </div>
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#F5C000]" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#F5C000]" />
              <div className="absolute -top-3 -right-3 w-6 h-6 border-2 border-[#F5C000]" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-2 border-[#F5C000]" />
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-6 md:gap-8">
            <SectionHeader
              badge={MAYORISTA_CONTENT.badge}
              badgeVariant="yellow"
              headline={MAYORISTA_CONTENT.headline}
              description={MAYORISTA_CONTENT.description}
            />
            <FeatureList items={MAYORISTA_CONTENT.features} iconColor="text-[#F5C000]" />
            <CTAGroup
              whatsappUrl={WHATSAPP_MAYORISTA_URL}
              whatsappLabel={MAYORISTA_CONTENT.ctaWhatsApp}
              downloadUrl={LISTA_MAYORISTA_URL}
              downloadLabel={MAYORISTA_CONTENT.ctaLista}
              variant="yellow"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
