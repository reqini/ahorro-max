import { getProductos, getCategorias } from '@/lib/productos'
import { CatalogoCards } from '@/components/catalogo/CatalogoCards'
import { WHATSAPP_NUMBER } from '@/constants/contact'
import Link from 'next/link'

export const revalidate = 60

export default async function CatalogoPage() {
  const [productos, categorias] = await Promise.all([getProductos(), getCategorias()])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10 bg-[#0d0d0d] sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-[#CC0000] font-black text-xl tracking-tight">AHORRA MAX</Link>
          <span className="text-white/30 text-sm">Catálogo de precios</span>
        </div>
      </header>
      <div className="max-w-4xl mx-auto">
        <CatalogoCards
          productos={productos}
          categorias={categorias}
          modo="publico"
          whatsappNumber={WHATSAPP_NUMBER}
        />
      </div>
    </div>
  )
}
