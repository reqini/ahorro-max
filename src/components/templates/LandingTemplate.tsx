import {
  NavbarVenta,
  HeroVenta,
  Beneficios,
  ZonasEntrega,
  MayoristaWhatsApp,
  ListaPrecios,
  ProximamenteLocal,
  FAQSection,
  Footer,
  PromoModal,
} from "@/components/organisms"
import { getPromoFlash } from "@/lib/promo"
import { getContactInfo } from "@/lib/whatsapp"
import { getMayoristaMinMonto } from "@/lib/zonas"

/**
 * Landing orientada a la venta minorista: el consumidor final llega, ve la
 * propuesta y entra al catálogo a comprar. El mayorista tiene su bloque aparte
 * que lo lleva a pedir la lista por WhatsApp.
 */
export async function LandingTemplate() {
  const [promo, { numero }, minimoMonto] = await Promise.all([
    getPromoFlash(),
    getContactInfo(),
    getMayoristaMinMonto(),
  ])

  return (
    <>
      {promo.activa && <PromoModal promo={promo} />}
      <NavbarVenta />
      <main>
        <HeroVenta />
        <Beneficios />
        <ZonasEntrega />
        <MayoristaWhatsApp numero={numero} minimoMonto={minimoMonto} />
        <ListaPrecios />
        <ProximamenteLocal />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
