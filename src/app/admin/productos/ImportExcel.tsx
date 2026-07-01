'use client'

import { useActionState, useRef } from 'react'
import { importProductosAction } from './actions'

const TEMPLATE_CSV =
  'Nombre,Precio Minorista,Precio Mayorista,Categoría,Descripción\n' +
  'Detergente 1L,850,720,Limpieza,Detergente concentrado\n' +
  'Yerba mate 500g,1450,1200,Almacén,\n'

function downloadTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'plantilla_productos.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function ImportExcel() {
  const [state, action, pending] = useActionState(importProductosAction, null)
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="border border-white/10 bg-[#111] p-5">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h2 className="text-white font-semibold text-sm">Importar desde Excel / CSV</h2>
          <p className="text-white/30 text-xs mt-0.5">
            Columnas: Nombre | Precio Minorista | Precio Mayorista | Categoría | Descripción
          </p>
        </div>
        <button
          type="button"
          onClick={downloadTemplate}
          className="text-xs px-3 py-1.5 border border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors"
        >
          ↓ Descargar plantilla
        </button>
      </div>

      <form ref={formRef} action={action} className="flex items-center gap-3 flex-wrap">
        <input
          name="file"
          type="file"
          accept=".xlsx,.xls,.csv"
          required
          className="flex-1 text-sm text-white/60 file:mr-3 file:px-3 file:py-2 file:border file:border-white/20 file:bg-white/5 file:text-white/70 file:text-xs file:font-medium hover:file:bg-white/10 file:transition-colors cursor-pointer"
        />
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2 bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 shrink-0"
        >
          {pending ? 'Importando...' : 'Importar'}
        </button>
      </form>

      {state?.count !== undefined && (
        <p className="mt-3 text-green-400 text-sm font-medium">
          ✓ {state.count} producto{state.count !== 1 ? 's' : ''} importado{state.count !== 1 ? 's' : ''} correctamente
        </p>
      )}
      {state?.error && (
        <p className="mt-3 text-red-400 text-sm">{state.error}</p>
      )}
    </div>
  )
}
