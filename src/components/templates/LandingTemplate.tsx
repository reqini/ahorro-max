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

export async function LandingTemplate() {
  const promo = await getPromoFlash()

  return (
    <>
      {promo.activa && <PromoModal promo={promo} />}
      <Navbar />
      <main>
        <Hero />
        <SectionMinorista />
        <SectionMayorista />
        <OfertasSection />
        <InfoSection />
        <FAQSection />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
