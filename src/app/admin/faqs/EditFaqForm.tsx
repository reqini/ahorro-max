'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { FaqItem } from '@/lib/faqs'

const INPUT = "w-full bg-[#1a1a1a] border border-white/30 text-white text-sm px-3 py-2 focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/45"

export function EditFaqForm({
  faq,
  updateAction,
}: {
  faq: FaqItem
  updateAction: (formData: FormData) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const qRef = useRef<HTMLInputElement>(null)
  const aRef = useRef<HTMLTextAreaElement>(null)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('q', qRef.current?.value ?? '')
    fd.append('a', aRef.current?.value ?? '')
    setSaving(true)
    await updateAction(fd)
    setSaving(false)
    setEditing(false)
    router.refresh()
  }

  if (!editing) {
    return (
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold">{faq.q}</p>
        <p className="text-white/50 text-xs mt-1 leading-relaxed">{faq.a}</p>
        <button
          onClick={() => setEditing(true)}
          className="mt-2 text-[10px] uppercase tracking-widest text-[#CC0000]/60 hover:text-[#CC0000] transition-colors font-bold"
        >
          Editar
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="flex-1 min-w-0 flex flex-col gap-2">
      <input
        ref={qRef}
        name="q"
        required
        defaultValue={faq.q}
        placeholder="Pregunta"
        className={INPUT}
      />
      <textarea
        ref={aRef}
        name="a"
        required
        rows={3}
        defaultValue={faq.a}
        placeholder="Respuesta"
        className={`${INPUT} resize-none`}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-1.5 bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="px-4 py-1.5 border border-white/20 text-white/50 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
