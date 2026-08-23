import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { buildBreadcrumbSchema } from '@/lib/schema'
import { JsonLd } from '@/components/atoms/JsonLd'
import { MayoristaVerticalHero, MayoristaVerticalFAQ, ZonasEntrega, MayoristaWhatsApp } from '@/components/organisms'
import { getMayoristaVerticals } from '@/constants/mayoristaVerticals'
import { getMayoristaMinMonto } from '@/lib/zonas'
import { getContactInfo } from '@/lib/whatsapp'

const SLUG = 'mayorista-para-restaurantes'
const path = `/${SLUG}`
const verticalMeta = getMayoristaVerticals().find((v) => v.slug === SLUG)!

export const revalidate = 60

export const metadata: Metadata = buildMetadata({
  title: verticalMeta.metaTitle,
  description: verticalMeta.metaDescription,
  path,
  keywords: verticalMeta.keywords,
})

export default async function MayoristaParaRestaurantesPage() {
  const [minimoMonto, { numero }] = await Promise.all([getMayoristaMinMonto(), getContactInfo()])
  const vertical = getMayoristaVerticals(minimoMonto, numero).find((v) => v.slug === SLUG)!

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([{ name: 'Inicio', path: '/' }, { name: vertical.badge, path }])} />
      <MayoristaVerticalHero vertical={vertical} minimoMonto={minimoMonto} />
      <ZonasEntrega />
      <MayoristaVerticalFAQ faqs={vertical.faqs} pageUrl={path} />
      <MayoristaWhatsApp numero={numero} minimoMonto={minimoMonto} />
    </>
  )
}
