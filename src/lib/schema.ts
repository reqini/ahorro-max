import { BASE_URL } from "@/constants"
import { parsearPrecio } from "./utils"
import type { FaqItem } from "./faqs"
import type { Producto } from "./productos"
import type { BlogPost } from "@/content/blog"

interface BreadcrumbItem {
  name: string
  /** Ruta relativa, con barra inicial. "/" para la home. */
  path: string
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  }
}

export function buildFaqPageSchema(faqs: FaqItem[], pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE_URL}${pageUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  }
}

/** Muestra de productos de una categoría, como Product+Offer. Pensado para una selección chica (5-8), no el catálogo entero. */
export function buildProductListSchema(productos: Producto[], categoria: string, pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${BASE_URL}${pageUrl}#productos`,
    name: `Productos mayoristas — ${categoria}`,
    itemListElement: productos.map((p, i) => {
      const precio = parsearPrecio(p.precio_minorista)
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: p.nombre,
          category: p.categoria,
          ...(p.marca && { brand: { "@type": "Brand", name: p.marca } }),
          ...(Number.isFinite(precio) && precio > 0
            ? { offers: { "@type": "Offer", price: precio, priceCurrency: "ARS", availability: "https://schema.org/InStock", url: `${BASE_URL}/catalogo/` } }
            : {}),
        },
      }
    }),
  }
}

export function buildArticleSchema(post: BlogPost, pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${BASE_URL}${pageUrl}#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@id": `${BASE_URL}/#business` },
    mainEntityOfPage: `${BASE_URL}${pageUrl}`,
    inLanguage: "es-AR",
  }
}
