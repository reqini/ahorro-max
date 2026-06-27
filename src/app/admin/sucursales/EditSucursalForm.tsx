'use client'

import { useState } from 'react'
import type { Sucursal } from '@/types/database'
import { updateSucursal } from './actions'

export function EditSucursalForm({ sucursal }: { sucursal: Sucursal }) {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs px-2 py-1 border border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors"
      >
        Editar
      </button>
    )
  }

  async function handleSubmit(formData: FormData) {
    await updateSucursal(formData)
    setOpen(false)
  }

  return (
    <form action={handleSubmit} className="mt-3 border border-white/10 bg-black/20 p-3 flex flex-col gap-2">
      <input type="hidden" name="id" value={sucursal.id} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="text-white/40 text-xs block mb-1">Nombre *</label>
          <input
            name="nombre"
            required
            defaultValue={sucursal.nombre}
            className="w-full bg-black border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40"
          />
        </div>
        <div>
          <label className="text-white/40 text-xs block mb-1">Dirección *</label>
          <input
            name="direccion"
            required
            defaultValue={sucursal.direccion}
            className="w-full bg-black border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40"
          />
        </div>
        <div>
          <label className="text-white/40 text-xs block mb-1">Teléfono</label>
          <input
            name="telefono"
            defaultValue={sucursal.telefono}
            className="w-full bg-black border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40"
          />
        </div>
        <div>
          <label className="text-white/40 text-xs block mb-1">Horarios</label>
          <input
            name="horarios"
            defaultValue={sucursal.horarios}
            className="w-full bg-black border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-white/40 text-xs block mb-1">URL de Google Maps</label>
          <input
            name="maps_url"
            defaultValue={sucursal.maps_url}
            className="w-full bg-black border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-1">
        <button
          type="submit"
          className="px-4 py-1.5 bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-1.5 border border-white/20 text-white/50 hover:text-white text-xs transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
