import Link from 'next/link'
import { getProductos } from '@/lib/productos'
import { parsearPrecio } from '@/lib/utils'
import { CATEGORIAS_LISTA, LISTA_ACTUALIZADA } from '@/constants/catalogo'
import { ListaPreciosGrilla } from './ListaPreciosGrilla'

/** "2026-08-14" → "14/08/2026", sin pasar por Date para no correrse de día por zona horaria. */
function fechaCorta(iso: string): string {
  const [a, m, d] = iso.split('-')
  return d && m && a ? `${d}/${m}/${a}` : iso
}

/**
 * La lista de precios en el home: el cliente ve qué se vende y a cuánto sin tener
 * que entrar al catálogo. Las categorías siguen el orden de la lista impresa y
 * las que aparezcan de más (cargadas desde el panel) van al final.
 */
export async function ListaPrecios() {
  const productos = await getProductos()
  const vendibles = productos.filter((p) => parsearPrecio(p.precio_minorista) > 0)

  if (vendibles.length === 0) return null

  const presentes = [...new Set(vendibles.map((p) => p.categoria).filter(Boolean))]
  const conocidas = CATEGORIAS_LISTA.filter((c) => presentes.includes(c))
  const otras = presentes.filter((c) => !conocidas.includes(c as never)).sort()
  const categorias = [...conocidas, ...otras]

  return (
    <section id="destacados" className="bg-[#0d0d0d] py-14 md:py-20">
      <div className="max-w-5xl mx-auto px-5">
        <div className="text-center mb-8">
          <span className="text-[#F5C000] text-xs font-bold uppercase tracking-[0.25em]">
            Precios de distribuidora
          </span>
          <h2 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tight mt-2">
            Lista de precios
          </h2>
          <p className="text-white/40 text-sm mt-2">
            {vendibles.length} artículos · precio por unidad y por pack cerrado · actualizada al{' '}
            {fechaCorta(LISTA_ACTUALIZADA)}
          </p>
        </div>

        <ListaPreciosGrilla productos={vendibles} categorias={categorias} />

        <div className="text-center mt-8">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#CC0000] hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wide transition-colors"
          >
            🛒 Armar mi pedido
          </Link>
          <p className="text-white/30 text-xs mt-3">
            Los precios pueden cambiar sin previo aviso. Confirmamos el total al tomar el pedido.
          </p>
        </div>
      </div>
    </section>
  )
}
