'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Resultado {
  asignadas: { archivo: string; producto: string; url: string }[]
  sinProducto: string[]
  rechazadas: string[]
}

/**
 * Carga de fotos reales en lote. Cada archivo se asigna al producto cuyo nombre
 * coincide con el del archivo, así se puede subir la lista entera de una en vez
 * de abrir producto por producto.
 */
export function SubirFotos({ nombres }: { nombres: string[] }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [subiendo, setSubiendo] = useState(false)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [error, setError] = useState('')

  async function subir(archivos: FileList | null) {
    if (!archivos || archivos.length === 0) return
    setSubiendo(true)
    setError('')
    setResultado(null)

    const body = new FormData()
    for (const archivo of Array.from(archivos)) body.append('files', archivo)

    try {
      const res = await fetch('/api/admin/upload-foto', { method: 'POST', body })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'No se pudieron subir las fotos')
      } else {
        setResultado(data as Resultado)
        router.refresh()
      }
    } catch {
      setError('No se pudieron subir las fotos. Revisá la conexión e intentá de nuevo.')
    } finally {
      setSubiendo(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="border border-white/10 bg-[#111] p-5">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h2 className="text-white font-semibold text-sm">Fotos de los productos</h2>
          <p className="text-white/30 text-xs mt-0.5">
            Elegí varias fotos juntas. Cada una va al producto que coincide con el nombre del archivo.
          </p>
        </div>
        <button
          type="button"
          onClick={() => descargarNombres(nombres)}
          disabled={nombres.length === 0}
          className="text-xs px-3 py-1.5 border border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors disabled:opacity-40"
        >
          ↓ Nombres de archivo
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        disabled={subiendo}
        onChange={(e) => subir(e.target.files)}
        className="w-full text-sm text-white/60 file:mr-3 file:px-3 file:py-2 file:border file:border-white/20 file:bg-white/5 file:text-white/70 file:text-xs file:font-medium hover:file:bg-white/10 file:transition-colors cursor-pointer disabled:opacity-50"
      />

      <p className="text-white/25 text-[11px] mt-2">
        Por ejemplo, la foto de &ldquo;Cerveza Quilmes 473ml x24&rdquo; tiene que llamarse{' '}
        <code className="text-white/40">cerveza-quilmes-473ml-x24.jpg</code>. JPG, PNG, WebP o AVIF, hasta 5MB
        cada una.
      </p>

      {subiendo && <p className="text-white/50 text-sm mt-3">Subiendo fotos...</p>}
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

      {resultado && (
        <div className="mt-3 space-y-1.5">
          <p className="text-green-400 text-sm font-medium">
            ✓ {resultado.asignadas.length} foto{resultado.asignadas.length !== 1 ? 's' : ''} asignada
            {resultado.asignadas.length !== 1 ? 's' : ''}
          </p>
          {resultado.sinProducto.length > 0 && (
            <p className="text-amber-400/80 text-xs">
              ⚠ Sin producto que coincida: {resultado.sinProducto.join(', ')}
            </p>
          )}
          {resultado.rechazadas.length > 0 && (
            <p className="text-red-400/80 text-xs">✕ {resultado.rechazadas.join(' · ')}</p>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Descarga la lista de nombres de archivo esperados, para poder renombrar las
 * fotos de una sin adivinar cómo se escribe cada producto.
 */
function descargarNombres(nombres: string[]) {
  const texto = nombres.join('\n')
  const url = URL.createObjectURL(new Blob([texto], { type: 'text/plain;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'nombres_fotos_productos.txt'
  a.click()
  URL.revokeObjectURL(url)
}
