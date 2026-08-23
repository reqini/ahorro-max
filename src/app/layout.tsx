import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { JsonLd } from "@/components/atoms/JsonLd"
import { BASE_URL, BUSINESS_NAME, BUSINESS_NAME_SHORT, CATEGORIAS_LISTA, ZONAS_DETALLE } from "@/constants"

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
    default: `Mayorista de Bebidas en Ciudadela | ${BUSINESS_NAME_SHORT}`,
    template: `%s | ${BUSINESS_NAME_SHORT}`,
  },
  description:
    "Mayorista de bebidas en Ciudadela, zona oeste del Gran Buenos Aires. Gaseosas, cervezas, aguas y más a precio de distribuidora. Pedí tu lista de precios por WhatsApp.",
  keywords: [
    "mayorista de bebidas Ciudadela",
    "distribuidora de bebidas zona oeste",
    "mayorista bebidas Buenos Aires",
    "distribuidora bebidas GBA",
    "proveedor mayorista de bebidas",
    "gaseosas mayorista",
    "cervezas mayorista Buenos Aires",
    "distribuidora Ciudadela",
    "distribuidora Tres de Febrero",
    "precios mayoristas zona oeste",
    "Ahorra Max distribuidora",
  ],
  authors: [{ name: BUSINESS_NAME }],
  creator: BUSINESS_NAME,
  publisher: BUSINESS_NAME,
  formatDetection: { telephone: true, email: false, address: true },
  alternates: { canonical: BASE_URL },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: `Mayorista de Bebidas en Ciudadela | ${BUSINESS_NAME_SHORT}`,
    description: "Distribuidora mayorista de bebidas en zona oeste del Gran Buenos Aires. Gaseosas, cervezas, aguas y más al precio de distribuidora.",
    type: "website",
    url: BASE_URL,
    siteName: BUSINESS_NAME_SHORT,
    locale: "es_AR",
    images: [{ url: `${BASE_URL}/logo.png`, width: 800, height: 600, alt: BUSINESS_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Mayorista de Bebidas en Ciudadela | ${BUSINESS_NAME_SHORT}`,
    description: "Distribuidora mayorista de bebidas en zona oeste del Gran Buenos Aires.",
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
      alternateName: BUSINESS_NAME_SHORT,
      description: "Distribuidora mayorista de bebidas en Ciudadela, zona oeste del Gran Buenos Aires. Gaseosas, cervezas, aguas, energizantes y aperitivos para kioscos, almacenes, restaurantes y eventos.",
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
      areaServed: ZONAS_DETALLE.flatMap((zona) => zona.barrios).map((barrio) => ({ "@type": "City", name: barrio })),
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "18:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "13:00" },
      ],
      priceRange: "$$",
      currenciesAccepted: "ARS",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Catálogo mayorista de bebidas",
        url: `${BASE_URL}/catalogo`,
        itemListElement: CATEGORIAS_LISTA.map((categoria) => ({ "@type": "OfferCatalog", name: categoria })),
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
        <JsonLd data={jsonLd} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
