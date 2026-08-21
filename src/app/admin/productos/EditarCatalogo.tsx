'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ComparacionPrecio, Producto } from '@/lib/productos'
import { updateCatalogoProducto } from './actions'

const INPUT =
  'w-full bg-[#1a1a1a] border border-white/20 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/30'

const CADENAS = ['Coto', 'Carrefour', 'Dia', 'Jumbo', 'Vea', 'Disco', 'La Anónima', 'ChangoMás']

/**
 * Editor de catálogo de un producto: foto, marca y comparaciones de precio contra
 * otras cadenas. Las comparaciones se cargan a mano (cadena, precio, link) para
 * que sean verificables; no se scrapea nada de la competencia.
 */
export function EditarCatalogo({ producto }: { producto: Producto }) {
  const router = useRouter()
  const [abierto, setAbierto] = useState(false)
  const [marca, setMarca] = useState(producto.marca)
  const [imagenUrl, setImagenUrl] = useState(producto.imagen_url)
  const [comparaciones, setComparaciones] = useState<ComparacionPrecio[]>(producto.comparaciones)
  const [guardando, setGuardando] = useState(false)
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const [ok, setOk] = useState(false)
  const [error, setError] = useState('')

  /**
   * Sube la foto real del producto y deja la URL cargada en el campo. Se guarda
   * sola: si el admin sube la foto y cierra el panel sin apretar "Guardar", la
   * foto igual quedó puesta, que es lo que esperaba que pasara.
   */
  async function subirFoto(archivo: File | undefined) {
    if (!archivo) return
    setSubiendoFoto(true)
    setError('')
    const body = new FormData()
    body.append('files', archivo)
    body.append('producto_id', producto.id)
    try {
      const res = await fetch('/api/admin/upload-foto', { method: 'POST', body })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'No se pudo subir la foto')
      } else if (data.rechazadas?.length) {
        setError(data.rechazadas.join(' · '))
      } else if (data.asignadas?.[0]?.url) {
        // El servidor ya dejó la foto guardada en el producto y devuelve su URL:
        // se refleja en el campo para ver el resultado sin cerrar el panel.
        setImagenUrl(data.asignadas[0].url)
        router.refresh()
        setOk(true)
        setTimeout(() => setOk(false), 2000)
      } else {
        setError('No se pudo asignar la foto a este producto')
      }
    } catch {
      setError('No se pudo subir la foto. Revisá la conexión e intentá de nuevo.')
    } finally {
      setSubiendoFoto(false)
    }
  }

  function setComp(i: number, campo: keyof ComparacionPrecio, valor: string) {
    setComparaciones((prev) => prev.map((c, j) => (j === i ? { ...c, [campo]: valor } : c)))
  }

  function agregar() {
    setComparaciones((prev) => [...prev, { cadena: '', precio: '', url: '', fecha: '' }])
  }

  function quitar(i: number) {
    setComparaciones((prev) => prev.filter((_, j) => j !== i))
  }

  async function guardar() {
    setGuardando(true)
    setError('')
    setOk(false)
    const res = await updateCatalogoProducto(producto.id, { marca, imagen_url: imagenUrl, comparaciones })
    setGuardando(false)
    if (res.error) {
      setError(res.error)
      return
    }
    setOk(true)
    router.refresh()
    setTimeout(() => setOk(false), 2000)
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="text-xs px-2 py-1 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors"
      >
        {producto.comparaciones.length > 0 || producto.imagen_url ? '🖼 Catálogo ✓' : '🖼 Catálogo'}
      </button>
    )
  }

  return (
    <div className="w-full border border-[#CC0000]/30 bg-[#0d0d0d] p-4 mt-2 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-white text-sm font-semibold">Catálogo — {producto.nombre}</p>
        <button type="button" onClick={() => setAbierto(false)} className="text-white/40 hover:text-white text-xs">
          Cerrar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Marca</label>
          <input value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Coca-Cola" className={INPUT} />
        </div>
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Foto (URL oficial de marca)</label>
          <input value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} placeholder="https://..." className={INPUT} />
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {imagenUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imagenUrl} alt="" className="w-20 h-20 object-contain bg-white/5 border border-white/10 p-1" />
        )}
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">o subí la foto real</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            disabled={subiendoFoto}
            onChange={(e) => subirFoto(e.target.files?.[0])}
            className="text-xs text-white/50 file:mr-3 file:px-3 file:py-1.5 file:border file:border-white/20 file:bg-white/5 file:text-white/70 file:text-xs hover:file:bg-white/10 file:transition-colors cursor-pointer disabled:opacity-50"
          />
          {subiendoFoto && <p className="text-white/40 text-xs mt-1">Subiendo foto...</p>}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-white/50 text-xs uppercase tracking-wide">Comparación con cadenas</label>
          <button type="button" onClick={agregar} className="text-xs text-[#F5C000] hover:underline">
            + Agregar cadena
          </button>
        </div>

        {comparaciones.length === 0 ? (
          <p className="text-white/25 text-xs">
            Sin comparaciones. Agregá el precio de referencia de una cadena y el link a su ecommerce.
          </p>
        ) : (
          <div className="space-y-2">
            {comparaciones.map((c, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2 items-center">
                <input
                  value={c.cadena}
                  onChange={(e) => setComp(i, 'cadena', e.target.value)}
                  list="cadenas-list"
                  placeholder="Coto"
                  className={INPUT}
                />
                <input
                  value={c.precio}
                  onChange={(e) => setComp(i, 'precio', e.target.value)}
                  inputMode="numeric"
                  placeholder="9600"
                  className={INPUT}
                />
                <input
                  value={c.url}
                  onChange={(e) => setComp(i, 'url', e.target.value)}
                  placeholder="https://cotodigital.com.ar/..."
                  className={INPUT}
                />
                <button
                  type="button"
                  onClick={() => quitar(i)}
                  className="text-red-500/70 hover:text-red-400 px-2 text-sm"
                  aria-label="Quitar"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <datalist id="cadenas-list">
          {CADENAS.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <p className="text-white/25 text-[11px] mt-2">
          El precio es de referencia y se guarda con la fecha de hoy. El link lleva al ecommerce de la
          cadena para que el cliente verifique. Revisá los valores cada tanto para que sigan siendo reales.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={guardar}
          disabled={guardando}
          className="bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 transition-colors disabled:opacity-40"
        >
          {guardando ? 'Guardando...' : 'Guardar catálogo'}
        </button>
        {ok && <span className="text-green-400 text-xs">✓ Guardado</span>}
        {error && <span className="text-red-400 text-xs">{error}</span>}
      </div>
    </div>
  )
}
