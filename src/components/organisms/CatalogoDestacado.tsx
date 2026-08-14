import Link from 'next/link'
import { getProductos } from '@/lib/productos'
import { formatearPrecio, parsearPrecio } from '@/lib/utils'
import { ProductoImagen } from '@/components/catalogo/ProductoImagen'

/** Vidriera de productos en el home. Cada card lleva al catálogo completo para pedir. */
export async function CatalogoDestacado() {
  const productos = await getProductos()
  const destacados = productos.filter((p) => parsearPrecio(p.precio_minorista) > 0).slice(0, 8)

  if (destacados.length === 0) return null

  return (
    <section id="destacados" className="bg-[#0d0d0d] py-14 md:py-20">
      <div className="max-w-5xl mx-auto px-5">
        <div className="text-center mb-8">
          <span className="text-[#F5C000] text-xs font-bold uppercase tracking-[0.25em]">
            Lo más pedido
          </span>
          <h2 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tight mt-2">
            Catálogo destacado
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {destacados.map((p) => (
            <Link
              key={p.id}
              href="/catalogo"
              className="group border border-white/10 bg-[#131313] flex flex-col overflow-hidden hover:border-white/25 transition-colors"
            >
              <ProductoImagen src={p.imagen_url} nombre={p.nombre} className="w-full aspect-square" />
              <div className="p-2.5 flex flex-col gap-1">
                {p.marca && (
                  <span className="text-white/35 text-[10px] uppercase tracking-wide">{p.marca}</span>
                )}
                <span className="text-white text-sm leading-tight line-clamp-2">{p.nombre}</span>
                <span className="text-white font-black text-base leading-none mt-0.5">
                  {formatearPrecio(p.precio_minorista)}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white hover:border-[#CC0000] hover:text-[#CC0000] text-sm font-bold uppercase tracking-wide transition-colors"
          >
            Ver catálogo completo →
          </Link>
        </div>
      </div>
    </section>
  )
}
