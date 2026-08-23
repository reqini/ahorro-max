import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { buildBreadcrumbSchema } from '@/lib/schema'
import { JsonLd } from '@/components/atoms/JsonLd'
import { MayoristaVerticalHero, MayoristaVerticalFAQ, ZonasEntrega, MayoristaWhatsApp } from '@/components/organisms'
import { MAYORISTA_VERTICALS } from '@/constants/mayoristaVerticals'

const vertical = MAYORISTA_VERTICALS.find((v) => v.slug === 'mayorista-para-kioscos')!
const path = `/${vertical.slug}`

export const metadata: Metadata = buildMetadata({
  title: vertical.metaTitle,
  description: vertical.metaDescription,
  path,
  keywords: vertical.keywords,
})

export default function MayoristaParaKioscosPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([{ name: 'Inicio', path: '/' }, { name: vertical.badge, path }])} />
      <MayoristaVerticalHero vertical={vertical} />
      <ZonasEntrega />
      <MayoristaVerticalFAQ faqs={vertical.faqs} pageUrl={path} />
      <MayoristaWhatsApp />
    </>
  )
}
