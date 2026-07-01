'use client'

import { useState } from 'react'
import { NuevoClienteForm } from './NuevoClienteForm'

interface Props {
  action: (fd: FormData) => Promise<void>
  vendedorUsername: string
}

export function NuevoClienteDrawer({ action, vendedorUsername }: Props) {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-4 z-40 w-14 h-14 bg-[#CC0000] hover:bg-red-700 text-white text-2xl font-bold rounded-full shadow-lg shadow-black/60 flex items-center justify-center transition-colors"
        aria-label="Nuevo cliente"
      >
        +
      </button>
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/70" onClick={() => setOpen(false)} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-white/10 rounded-t-2xl px-5 pt-5 pb-8 max-h-[92vh] overflow-y-auto max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-base">Nuevo cliente</h2>
          <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white text-xl">✕</button>
        </div>
        <NuevoClienteForm action={action} onCancel={() => setOpen(false)} vendedorUsername={vendedorUsername} />
      </div>
    </>
  )
}
