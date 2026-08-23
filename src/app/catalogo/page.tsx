import type { Metadata } from 'next'
import { getProductos, getCategorias } from '@/lib/productos'
import { getSiteConfig } from '@/lib/config'
import { buildMetadata } from '@/lib/seo'
import { buildBreadcrumbSchema, buildProductListSchema } from '@/lib/schema'
import { JsonLd } from '@/components/atoms/JsonLd'
import { CatalogoPublico } from '@/components/catalogo/CatalogoPublico'
import { WHATSAPP_NUMBER } from '@/constants/contact'

export const revalidate = 60

const PATH = '/catalogo'
/** Tope de productos por categoría en el ItemList — es una muestra para rich results, no el catálogo entero. */
const MAX_PRODUCTOS_POR_CATEGORIA_SCHEMA = 8

export const metadata: Metadata = buildMetadata({
  title: 'Catálogo Mayorista y Minorista de Bebidas',
  description:
    'Gaseosas, cervezas, aguas, energizantes y aperitivos a precio minorista y mayorista. Lista de precios actualizada, armá tu pedido online o consultá por WhatsApp.',
  path: PATH,
  keywords: [
    'catálogo mayorista Ciudadela',
    'lista de precios mayorista bebidas',
    'comprar bebidas online Ciudadela',
    'catálogo distribuidora Ahorra Max',
    'precios gaseosas cervezas mayorista',
  ],
})

export default async function CatalogoPage() {
  const [productos, categorias, config] = await Promise.all([
    getProductos(),
    getCategorias(),
    getSiteConfig(),
  ])

  const whatsapp = config.whatsapp_number || WHATSAPP_NUMBER

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([{ name: 'Inicio', path: '/' }, { name: 'Catálogo', path: PATH }])} />
      {categorias.map((categoria) => {
        const productosDeCategoria = productos.filter((p) => p.categoria === categoria).slice(0, MAX_PRODUCTOS_POR_CATEGORIA_SCHEMA)
        if (productosDeCategoria.length === 0) return null
        return <JsonLd key={categoria} data={buildProductListSchema(productosDeCategoria, categoria, PATH)} />
      })}
      <CatalogoPublico productos={productos} categorias={categorias} whatsappNumber={whatsapp} />
    </>
  )
}
