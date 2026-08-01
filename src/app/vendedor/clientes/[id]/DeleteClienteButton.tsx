'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// window.confirm queda bloqueado en varias webviews y en la PWA: el vendedor tocaba
// eliminar y no pasaba nada. La confirmación se pide dentro de la interfaz.

export function DeleteClienteButton({ action }: { action: () => Promise<void> }) {
  const router = useRouter()
  const [confirmando, setConfirmando] = useState(false)
  const [borrando, setBorrando] = useState(false)

  async function eliminar() {
    setBorrando(true)
    await action()
    router.refresh()
  }

  if (confirmando) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-white/50 text-xs">¿Eliminar cliente y sus notas?</span>
        <button
          type="button"
          onClick={() => setConfirmando(false)}
          disabled={borrando}
          className="text-xs px-2.5 py-1.5 border border-white/20 text-white/60"
        >
          No
        </button>
        <button
          type="button"
          onClick={eliminar}
          disabled={borrando}
          className="text-xs px-2.5 py-1.5 bg-red-800 hover:bg-red-700 text-white font-bold disabled:opacity-40"
        >
          {borrando ? '...' : 'Sí'}
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirmando(true)}
      className="text-xs px-3 py-1.5 border border-red-900/60 text-red-500/70 hover:text-red-400 hover:border-red-600 transition-colors"
    >
      Eliminar
    </button>
  )
}

export function DeleteNotaButton({ action }: { action: () => Promise<void> }) {
  const router = useRouter()
  const [confirmando, setConfirmando] = useState(false)

  async function eliminar() {
    await action()
    router.refresh()
  }

  if (confirmando) {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => setConfirmando(false)}
          className="text-white/40 text-[11px] px-1.5"
        >
          No
        </button>
        <button
          type="button"
          onClick={eliminar}
          className="text-[11px] px-2 py-1 bg-red-800 text-white font-bold"
        >
          Borrar
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirmando(true)}
      className="text-white/20 hover:text-red-400 transition-colors text-sm mt-0.5 shrink-0"
    >
      ✕
    </button>
  )
}
