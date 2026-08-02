import { getProductos, getCategorias } from '@/lib/productos'
import { getSiteConfig } from '@/lib/config'
import { CatalogoPublico } from '@/components/catalogo/CatalogoPublico'
import { WHATSAPP_NUMBER } from '@/constants/contact'

export const revalidate = 60

export default async function CatalogoPage() {
  const [productos, categorias, config] = await Promise.all([
    getProductos(),
    getCategorias(),
    getSiteConfig(),
  ])

  const whatsapp = config.whatsapp_number || WHATSAPP_NUMBER

  return <CatalogoPublico productos={productos} categorias={categorias} whatsappNumber={whatsapp} />
}
