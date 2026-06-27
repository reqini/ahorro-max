'use client'

import { useState, useRef } from 'react'

interface PreciosFormProps {
  tipo: 'minorista' | 'mayorista'
  label: string
  currentUrl: string
}

export function PreciosForm({ tipo, label, currentUrl }: PreciosFormProps) {
  const [uploading, setUploading] = useState(false)
  const [url, setUrl] = useState(currentUrl)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const file = inputRef.current?.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData()
    formData.append('tipo', tipo)
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload-pdf', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error al subir el archivo')
      } else {
        setUrl(data.url)
        setSuccess(true)
        if (inputRef.current) inputRef.current.value = ''
      }
    } catch {
      setError('Error de red. Intentá de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  const accent = tipo === 'minorista' ? '#CC0000' : '#F5C000'
  const borderColor = tipo === 'minorista' ? 'border-[#CC0000]/40' : 'border-[#F5C000]/40'
  const labelColor = tipo === 'minorista' ? 'text-[#CC0000]' : 'text-[#F5C000]'

  return (
    <div className={`border ${borderColor} bg-black/30 p-5`}>
      <h2 className={`${labelColor} font-black uppercase tracking-wider text-sm mb-4`}>{label}</h2>

      {/* Current file */}
      <div className="mb-4">
        <p className="text-white/40 text-xs uppercase tracking-wide mb-1.5">Archivo actual</p>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/70 hover:text-white underline break-all"
          >
            {url.length > 60 ? url.slice(0, 60) + '...' : url}
          </a>
        ) : (
          <p className="text-white/30 text-sm">Sin archivo subido</p>
        )}
      </div>

      {/* Upload form */}
      <form onSubmit={handleUpload} className="flex flex-col gap-3">
        <div>
          <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">
            Subir nuevo PDF
          </label>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            required
            className="w-full text-sm text-white/70 file:mr-3 file:px-3 file:py-1.5 file:border file:border-white/20 file:bg-white/5 file:text-white/60 file:text-xs file:cursor-pointer hover:file:bg-white/10 file:transition-colors"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
        {success && (
          <p className="text-green-400 text-sm">Archivo subido correctamente.</p>
        )}

        <button
          type="submit"
          disabled={uploading}
          style={{ backgroundColor: uploading ? undefined : accent }}
          className={`self-start px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            uploading
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : tipo === 'minorista'
              ? 'text-white hover:bg-red-700'
              : 'text-black hover:opacity-90'
          }`}
        >
          {uploading ? 'Subiendo...' : 'Subir PDF'}
        </button>
      </form>
    </div>
  )
}
