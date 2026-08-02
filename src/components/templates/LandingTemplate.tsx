import {
  NavbarVenta,
  HeroVenta,
  Beneficios,
  ZonasEntrega,
  MayoristaWhatsApp,
  FAQSection,
  Footer,
  PromoModal,
} from "@/components/organisms"
import { getPromoFlash } from "@/lib/promo"

/**
 * Landing orientada a la venta minorista: el consumidor final llega, ve la
 * propuesta y entra al catálogo a comprar. El mayorista tiene su bloque aparte
 * que lo lleva a pedir la lista por WhatsApp.
 */
export async function LandingTemplate() {
  const promo = await getPromoFlash()

  return (
    <>
      {promo.activa && <PromoModal promo={promo} />}
      <NavbarVenta />
      <main>
        <HeroVenta />
        <Beneficios />
        <ZonasEntrega />
        <MayoristaWhatsApp />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
