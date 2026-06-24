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
} from "@/components/organisms"

export function LandingTemplate() {
  return (
    <>
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
