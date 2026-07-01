import { getAllProductos } from '@/lib/productos'
import { addProducto, deleteProducto, toggleProducto } from './actions'
import { DeleteButton } from '@/app/admin/components/DeleteButton'
import { ImportExcel } from './ImportExcel'

const INPUT = "w-full bg-[#1a1a1a] border border-white/20 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/30"

const CATEGORIAS_SUGERIDAS = ['Almacén', 'Limpieza', 'Higiene', 'Bebidas', 'Lácteos', 'Congelados', 'Verdulería', 'Otro']

export default async function ProductosAdminPage() {
  const productos = await getAllProductos()

  const categorias = [...new Set(productos.map((p) => p.categoria).filter(Boolean))].sort()
  const porCategoria = categorias.reduce<Record<string, typeof productos>>((acc, cat) => {
    acc[cat] = productos.filter((p) => p.categoria === cat)
    return acc
  }, {})
  const sinCategoria = productos.filter((p) => !p.categoria)

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white">Productos</h1>
          <p className="text-white/40 text-sm mt-0.5">{productos.length} productos · visible en la app del vendedor</p>
        </div>
      </div>

      {/* Import */}
      <div className="mb-6">
        <ImportExcel />
      </div>

      {/* Product list */}
      {productos.length === 0 ? (
        <p className="text-white/30 text-sm py-8">No hay productos todavía. Importá desde Excel o agregá uno manualmente.</p>
      ) : (
        <div className="mb-8 flex flex-col gap-6">
          {[...Object.entries(porCategoria), ...(sinCategoria.length ? [['Sin categoría', sinCategoria] as [string, typeof productos]] : [])].map(([cat, prods]) => (
            <div key={cat}>
              <h2 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 px-1">{cat}</h2>
              <div className="border border-white/5 divide-y divide-white/5">
                {prods.map((p) => {
                  const boundDelete = deleteProducto.bind(null, p.id)
                  const boundToggle = toggleProducto.bind(null, p.id, !p.activo)
                  return (
                    <div key={p.id} className={`flex items-center gap-3 px-4 py-3 ${!p.activo ? 'opacity-40' : ''}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{p.nombre}</p>
                        {p.descripcion && <p className="text-white/30 text-xs truncate">{p.descripcion}</p>}
                      </div>
                      <div className="flex items-center gap-4 shrink-0 text-right">
                        {p.precio_minorista && (
                          <div>
                            <p className="text-[10px] text-white/30 uppercase">Minorista</p>
                            <p className="text-white/80 text-sm font-semibold">${p.precio_minorista}</p>
                          </div>
                        )}
                        {p.precio_mayorista && (
                          <div>
                            <p className="text-[10px] text-[#F5C000]/60 uppercase">Mayorista</p>
                            <p className="text-[#F5C000] text-sm font-semibold">${p.precio_mayorista}</p>
                          </div>
                        )}
                        <form action={boundToggle}>
                          <button type="submit" className="text-xs px-2 py-1 border border-white/10 text-white/30 hover:text-white hover:border-white/30 transition-colors">
                            {p.activo ? 'Ocultar' : 'Mostrar'}
                          </button>
                        </form>
                        <DeleteButton action={boundDelete} label={`¿Eliminar ${p.nombre}?`} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add manual */}
      <div className="border border-white/10 bg-[#111] p-5">
        <h2 className="text-white font-semibold text-sm mb-4">Agregar producto manualmente</h2>
        <form action={addProducto} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Nombre *</label>
              <input name="nombre" required placeholder="Detergente líquido 1L" className={INPUT} />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Precio Minorista</label>
              <input name="precio_minorista" placeholder="850" className={INPUT} />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Precio Mayorista</label>
              <input name="precio_mayorista" placeholder="720" className={INPUT} />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Categoría</label>
              <input name="categoria" list="cats-list" placeholder="Limpieza" className={INPUT} />
              <datalist id="cats-list">
                {CATEGORIAS_SUGERIDAS.map((c) => <option key={c} value={c} />)}
                {categorias.filter((c) => !CATEGORIAS_SUGERIDAS.includes(c)).map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Descripción</label>
              <input name="descripcion" placeholder="Opcional" className={INPUT} />
            </div>
          </div>
          <button type="submit"
            className="self-start bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 transition-colors">
            Agregar
          </button>
        </form>
      </div>
    </div>
  )
}
