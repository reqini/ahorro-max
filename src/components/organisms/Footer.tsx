import { Logo } from "@/components/atoms"
import { NavLink } from "@/components/molecules"
import { WhatsAppIcon } from "@/components/atoms"
import {
  DIRECCION,
  TELEFONO_DISPLAY,
  WHATSAPP_MINORISTA_URL,
  FOOTER_CONTENT,
  NAVBAR_LINKS,
} from "@/constants"
import { MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer
      id="footer"
      className="bg-black border-t border-[#CC0000]"
    >
      {/* Top footer bar */}
      <div className="h-1 bg-gradient-to-r from-[#CC0000] via-[#F5C000] to-[#CC0000]" />

      <div className="max-w-7xl mx-auto px-5 md:px-12 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Logo size="md" />
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Distribuidora mayorista y minorista de productos de consumo masivo.
              Ciudadela, Buenos Aires.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <h3
              className="text-[#F5C000] font-black uppercase tracking-wider text-sm"
              style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif" }}
            >
              Navegación
            </h3>
            <nav className="flex flex-col gap-2">
              {NAVBAR_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  className="text-white/60 hover:text-[#F5C000]"
                />
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3
              className="text-[#F5C000] font-black uppercase tracking-wider text-sm"
              style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif" }}
            >
              Contacto
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={WHATSAPP_MINORISTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/80 hover:text-[#25D366] transition-colors"
              >
                <WhatsAppIcon size={18} className="text-[#25D366]" />
                <span className="text-sm font-semibold">{TELEFONO_DISPLAY}</span>
              </a>
              <div className="flex items-start gap-2 text-white/60">
                <MapPin size={18} className="text-[#CC0000] shrink-0 mt-0.5" />
                <span className="text-sm">{DIRECCION}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">{FOOTER_CONTENT.copyright}</p>
          <p className="text-white/40 text-xs">{FOOTER_CONTENT.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
