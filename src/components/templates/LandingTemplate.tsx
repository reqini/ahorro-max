import {
  Navbar,
  Hero,
  SectionMinorista,
  SectionMayorista,
  OfertasSection,
  InfoSection,
  FAQSection,
  ContactForm,
  Footer,
  PromoModal,
} from "@/components/organisms"
import { getPromoFlash } from "@/lib/promo"
import { getSiteConfig } from "@/lib/config"
import { CATALOGO_MINORISTA_URL, LISTA_MAYORISTA_URL } from "@/constants"

export async function LandingTemplate() {
  const [promo, config] = await Promise.all([getPromoFlash(), getSiteConfig()])

  const minoristaUrl = config.lista_minorista_url || CATALOGO_MINORISTA_URL
  const mayoristaUrl = config.lista_mayorista_url || LISTA_MAYORISTA_URL

  return (
    <>
      {promo.activa && <PromoModal promo={promo} />}
      <Navbar />
      <main>
        <Hero />
        <SectionMinorista catalogoUrl={minoristaUrl} />
        <SectionMayorista listaUrl={mayoristaUrl} />
        <OfertasSection />
        <InfoSection />
        <FAQSection />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
