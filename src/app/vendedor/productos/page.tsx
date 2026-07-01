import { getProductos, getCategorias } from '@/lib/productos'
import { ProductosView } from './ProductosView'

interface PageProps {
  searchParams: Promise<{ q?: string; cat?: string }>
}

export default async function VendedorProductosPage({ searchParams }: PageProps) {
  const params = await searchParams
  const busqueda = params.q
  const catFiltro = params.cat

  const [productos, todosLosProductos, categorias] = await Promise.all([
    getProductos({ categoria: catFiltro, busqueda }),
    getProductos(), // total count without filters
    getCategorias(),
  ])

  return (
    <div className="flex flex-col">
      <ProductosView
        serverProductos={productos}
        allCount={todosLosProductos.length}
        categorias={categorias}
        busqueda={busqueda}
        catFiltro={catFiltro}
      />
    </div>
  )
}
