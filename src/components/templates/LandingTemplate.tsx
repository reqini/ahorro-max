import {
  Navbar,
  Hero,
  SectionMinorista,
  SectionMayorista,
  InfoSection,
  FAQSection,
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
        <InfoSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
