'use client'

import { useRouter } from 'next/navigation'

export function DeleteClienteButton({ action }: { action: () => Promise<void> }) {
  const router = useRouter()
  async function handleClick() {
    if (!confirm('¿Eliminar este cliente y todas sus notas?')) return
    await action()
    router.refresh()
  }
  return (
    <button type="button" onClick={handleClick}
      className="text-xs px-3 py-1.5 border border-red-900/60 text-red-500/70 hover:text-red-400 hover:border-red-600 transition-colors">
      Eliminar
    </button>
  )
}

export function DeleteNotaButton({ action }: { action: () => Promise<void> }) {
  const router = useRouter()
  async function handleClick() {
    if (!confirm('¿Eliminar esta nota?')) return
    await action()
    router.refresh()
  }
  return (
    <button type="button" onClick={handleClick}
      className="text-white/20 hover:text-red-400 transition-colors text-sm mt-0.5 shrink-0">
      ✕
    </button>
  )
}
