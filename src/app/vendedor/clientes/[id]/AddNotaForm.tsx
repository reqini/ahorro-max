'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export function AddNotaForm({ action }: { action: (fd: FormData) => Promise<void> }) {
  const [saving, setSaving] = useState(false)
  const ref = useRef<HTMLFormElement>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const texto = (new FormData(ref.current!).get('texto') as string)?.trim()
    if (!texto) return
    setSaving(true)
    await action(new FormData(ref.current!))
    ref.current!.reset()
    setSaving(false)
    router.refresh()
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        name="texto"
        rows={2}
        placeholder="Agregar nota..."
        className="flex-1 bg-[#1a1a1a] border border-white/20 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/35 resize-none"
      />
      <button
        type="submit"
        disabled={saving}
        className="bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-2 transition-colors disabled:opacity-50 self-stretch"
      >
        {saving ? '...' : 'Agregar'}
      </button>
    </form>
  )
}
