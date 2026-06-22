import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/contexts/ThemeContext"

const BASE_URL = "https://www.ahorramax.com.ar"
const BUSINESS_NAME = "Distribuidora Ahorra Max"
const PHONE = "+541150203114"
const ADDRESS_STREET = "25 de mayo 108"
const ADDRESS_LOCALITY = "Ciudadela"
const ADDRESS_REGION = "Buenos Aires"
const ADDRESS_POSTAL = "1702"
const ADDRESS_COUNTRY = "AR"
const WHATSAPP_URL = "https://wa.me/541150203114"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${BUSINESS_NAME} | Mayorista y Minorista | Ciudadela, Buenos Aires`,
    template: `%s | ${BUSINESS_NAME}`,
  },
  description:
    "Distribuidora de productos de consumo masivo en Ciudadela, Buenos Aires. Precios mayoristas para almacenes, kioscos y revendedores. Atención minorista sin mínimo. WhatsApp: 11 5020-3114.",
  keywords: [
    "distribuidora Ciudadela",
    "mayorista consumo masivo Buenos Aires",
    "minorista Ciudadela",
    "distribuidora Tres de Febrero",
    "precios mayoristas zona oeste",
    "almacén proveedor Buenos Aires",
    "kiosco proveedor GBA",
    "productos limpieza mayorista",
    "alimentos mayorista Buenos Aires",
    "Ahorra Max distribuidora",
    "distribuidora 25 de mayo Ciudadela",
  ],
  authors: [{ name: BUSINESS_NAME }],
  creator: BUSINESS_NAME,
  publisher: BUSINESS_NAME,
  formatDetection: { telephone: true, email: false, address: true },
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: `${BUSINESS_NAME} | Mayorista y Minorista`,
    description: "Tu distribuidora de confianza en Ciudadela. Productos de consumo masivo al mejor precio para minoristas y revendedores.",
    type: "website",
    url: BASE_URL,
    siteName: BUSINESS_NAME,
    locale: "es_AR",
    images: [{ url: `${BASE_URL}/logo.png`, width: 800, height: 600, alt: BUSINESS_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS_NAME} | Mayorista y Minorista | Ciudadela`,
    description: "Distribuidora de consumo masivo en Ciudadela, Buenos Aires.",
    images: [`${BASE_URL}/logo.png`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1 } },
  category: "business",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/#business`,
      name: BUSINESS_NAME,
      alternateName: "Ahorra Max",
      description: "Distribuidora mayorista y minorista de productos de consumo masivo en Ciudadela, Buenos Aires.",
      url: BASE_URL,
      telephone: PHONE,
      contactPoint: [
        { "@type": "ContactPoint", telephone: PHONE, contactType: "customer service", availableLanguage: "Spanish", areaServed: "AR" },
        { "@type": "ContactPoint", url: WHATSAPP_URL, contactType: "sales", availableLanguage: "Spanish" },
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: ADDRESS_STREET,
        addressLocality: ADDRESS_LOCALITY,
        addressRegion: ADDRESS_REGION,
        postalCode: ADDRESS_POSTAL,
        addressCountry: ADDRESS_COUNTRY,
      },
      geo: { "@type": "GeoCoordinates", latitude: -34.6277, longitude: -58.5588 },
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "18:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "13:00" },
      ],
      priceRange: "$$",
      currenciesAccepted: "ARS",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Catálogo de productos",
        url: `${BASE_URL}/catalogo-mayorista.pdf`,
      },
      sameAs: [WHATSAPP_URL],
      image: `${BASE_URL}/logo.png`,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: BUSINESS_NAME,
      inLanguage: "es-AR",
      publisher: { "@id": `${BASE_URL}/#business` },
    },
    {
      "@type": "FAQPage",
      "@id": `${BASE_URL}/#faq`,
      mainEntity: [
        { "@type": "Question", name: "¿Dónde está ubicada la Distribuidora Ahorra Max?", acceptedAnswer: { "@type": "Answer", text: "En 25 de mayo 108, Ciudadela, CP 1702, Partido de Tres de Febrero, Buenos Aires." } },
        { "@type": "Question", name: "¿Venden al por mayor y al por menor?", acceptedAnswer: { "@type": "Answer", text: "Sí. Atendemos consumidores finales sin mínimo y revendedores con precios por volumen." } },
        { "@type": "Question", name: "¿Cuál es el WhatsApp?", acceptedAnswer: { "@type": "Answer", text: "+54 11 5020-3114" } },
        { "@type": "Question", name: "¿Cuáles son los horarios?", acceptedAnswer: { "@type": "Answer", text: "Lunes a viernes 8:00-18:00 | Sábados 8:00-13:00 | Domingos cerrado." } },
      ],
    },
  ],
}

// Script anti-FOUC: aplica el tema guardado antes de que React hidrate
const themeScript = `
  try {
    var t = localStorage.getItem('ahorra-max-theme');
    if (t) document.documentElement.setAttribute('data-theme', t);
  } catch(e) {}
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
