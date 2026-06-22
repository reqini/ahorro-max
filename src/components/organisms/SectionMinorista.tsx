import { SectionHeader, CTAGroup, FeatureList } from "@/components/molecules"
import {
  MINORISTA_CONTENT,
  WHATSAPP_MINORISTA_URL,
  CATALOGO_MINORISTA_URL,
} from "@/constants"

export function SectionMinorista() {
  return (
    <section
      id="minorista"
      className="relative flex items-center bg-black overflow-hidden"
    >
      {/* Red accent left bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 md:w-2 bg-[#CC0000]" />

      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-5"
          style={{ background: "linear-gradient(to left, #CC0000 0%, transparent 100%)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 opacity-10 rotate-45"
          style={{ background: "#CC0000" }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-[#CC0000]/30" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#CC0000]/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-12 py-14 md:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Text */}
          <div className="flex flex-col gap-6 md:gap-8">
            <SectionHeader
              badge={MINORISTA_CONTENT.badge}
              badgeVariant="red"
              headline={MINORISTA_CONTENT.headline}
              description={MINORISTA_CONTENT.description}
            />
            <FeatureList items={MINORISTA_CONTENT.features} iconColor="text-[#CC0000]" />
            <CTAGroup
              whatsappUrl={WHATSAPP_MINORISTA_URL}
              whatsappLabel={MINORISTA_CONTENT.ctaWhatsApp}
              downloadUrl={CATALOGO_MINORISTA_URL}
              downloadLabel={MINORISTA_CONTENT.ctaCatalogo}
              variant="red"
            />
          </div>

          {/* Visual block — desktop only */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              <div className="w-72 h-72 border-4 border-[#CC0000] flex items-center justify-center">
                <div className="text-center px-8">
                  <div
                    className="text-8xl font-black text-[#CC0000] leading-none"
                    style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif" }}
                  >%</div>
                  <div
                    className="text-2xl font-black text-white uppercase mt-2"
                    style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif" }}
                  >Mejor precio</div>
                  <div className="text-white/60 text-sm mt-1">Para el consumidor final</div>
                </div>
              </div>
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#CC0000]" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#CC0000]" />
              <div className="absolute -top-3 -right-3 w-6 h-6 border-2 border-[#CC0000]" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-2 border-[#CC0000]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
