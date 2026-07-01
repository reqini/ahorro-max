import { ContactCard } from "@/components/molecules"
import { SectionHeader } from "@/components/molecules"
import {
  DIRECCION,
  TELEFONO_DISPLAY,
  HORARIOS,
  WHATSAPP_MINORISTA_URL,
  INFO_CONTENT,
  ZONAS_ENTREGA,
} from "@/constants"
import { MapPin, Phone, Clock, Truck } from "lucide-react"
import { WhatsAppIcon } from "@/components/atoms"
import { getZonasEntrega } from "@/lib/zonas"
import { MapaZona } from "./MapaZona"

export async function InfoSection() {
  const zonas = await getZonasEntrega()
  return (
    <section
      id="info"
      className="relative bg-[#0d0d0d] overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#CC0000] via-[#F5C000] to-[#CC0000]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-12 py-10 md:py-20 w-full">
        <div className="flex flex-col gap-10 md:gap-16">
          <SectionHeader
            headline={INFO_CONTENT.headline}
            description={INFO_CONTENT.subheadline}
            align="center"
            headlineColor="text-white"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-start">
            {/* Contact cards */}
            <div className="flex flex-col gap-3 md:gap-4">
              <ContactCard icon={<MapPin size={22} />} title="Dirección">
                <p className="font-semibold">{DIRECCION}</p>
              </ContactCard>

              <ContactCard icon={<WhatsAppIcon size={22} />} title="WhatsApp">
                <a
                  href={WHATSAPP_MINORISTA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:text-[#F5C000] transition-colors"
                >
                  {TELEFONO_DISPLAY}
                </a>
              </ContactCard>

              <ContactCard icon={<Phone size={22} />} title="Teléfono">
                <p className="font-semibold">{TELEFONO_DISPLAY}</p>
              </ContactCard>

              <ContactCard icon={<Clock size={22} />} title="Horarios de atención">
                <div className="flex flex-col gap-1">
                  {HORARIOS.map((h) => (
                    <div key={h.dias} className="flex justify-between gap-4">
                      <span className="text-white/60 text-sm">{h.dias}</span>
                      <span className="font-semibold text-sm">{h.horario}</span>
                    </div>
                  ))}
                </div>
              </ContactCard>

              <ContactCard icon={<Truck size={22} />} title={ZONAS_ENTREGA.headline}>
                <div className="flex flex-wrap gap-2">
                  {zonas.map((zona) => (
                    <span
                      key={zona}
                      className="px-2 py-0.5 bg-[#CC0000]/15 border border-[#CC0000]/30 text-white text-xs font-semibold"
                    >
                      {zona}
                    </span>
                  ))}
                </div>
                <p className="text-white/50 text-xs mt-2">{ZONAS_ENTREGA.nota}</p>
              </ContactCard>
            </div>

            {/* Mapa Leaflet con zona Ciudadela */}
            <div className="flex flex-col gap-3">
              <div className="relative w-full border border-[#CC0000]/30 overflow-hidden" style={{ height: '360px' }}>
                <MapaZona />
              </div>
              <a
                href="https://www.google.com/maps/place/Ciudadela,+Buenos+Aires,+Argentina"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-[#CC0000] hover:bg-red-700 text-white font-bold uppercase tracking-wider py-3 text-sm transition-colors"
              >
                <MapPin size={15} />
                {INFO_CONTENT.mapPlaceholder}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
