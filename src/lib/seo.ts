import type { Metadata } from "next"
import { BASE_URL, BUSINESS_NAME_SHORT } from "@/constants"

interface PageMetaInput {
  /** Segmento de título de la página — el template del layout raíz agrega " | Ahorra Max". */
  title: string
  /** ≤155 caracteres, con keyword + CTA. */
  description: string
  /** Ruta relativa, con barra inicial. Ej: "/productos/gaseosas". */
  path: string
  /** Ruta de imagen relativa a metadataBase. Por defecto el logo. */
  image?: string
  keywords?: string[]
  noIndex?: boolean
}

/** Helper único de metadata para las páginas nuevas: title/description/canonical/OG/Twitter consistentes. */
export function buildMetadata({ title, description, path, image, keywords, noIndex }: PageMetaInput): Metadata {
  const url = `${BASE_URL}${path}`
  const img = image ?? "/logo.png"

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: BUSINESS_NAME_SHORT,
      locale: "es_AR",
      images: [{ url: img }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [img],
    },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
  }
}
