'use client'

import { useActionState } from 'react'
import { importDireccionesAction } from './actions'

const TEMPLATE_CSV =
  'Domicilio,Barrio,Localidad,Partido\n' +
  'Acoyte 176,Caballito,C.A.B.A.,C.A.B.A.\n' +
  'Manzone 851,,Acassuso,San Isidro\n' +
  'Mitre Bartolomé 1136,,Adrogué,Almirante Brown\n'

function descargarPlantilla() {
  const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'plantilla_direcciones.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function ImportDirecciones() {
  const [state, action, pending] = useActionState(importDireccionesAction, null)

  return (
    <div className="border border-white/20 bg-[#131313] shadow-xl shadow-black/60 p-5">
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h2 className="text-white font-semibold text-sm">Importar padrón de direcciones</h2>
          <p className="text-white/35 text-xs mt-1 max-w-md">
            Lee todas las hojas del archivo. Columnas reconocidas:{' '}
            <span className="text-white/55">Domicilio</span> o <span className="text-white/55">Dirección</span> (obligatoria) +{' '}
            <span className="text-white/55">Barrio</span>, <span className="text-white/55">Localidad</span> o{' '}
            <span className="text-white/55">Partido</span>.
          </p>
        </div>
        <button
          type="button"
          onClick={descargarPlantilla}
          className="text-xs px-3 py-1.5 border border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors shrink-0"
        >
          ↓ Descargar plantilla
        </button>
      </div>

      <form action={action} className="flex items-center gap-3 flex-wrap">
        <input
          name="file"
          type="file"
          accept=".xlsx,.xls,.csv"
          required
          className="flex-1 min-w-[200px] text-sm text-white/60 file:mr-3 file:px-3 file:py-2 file:border file:border-white/20 file:bg-white/5 file:text-white/70 file:text-xs file:font-medium hover:file:bg-white/10 file:transition-colors cursor-pointer"
        />
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2 bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 shrink-0"
        >
          {pending ? 'Importando...' : 'Importar'}
        </button>
      </form>

      {pending && (
        <p className="mt-3 text-white/40 text-xs">
          Procesando el archivo. Un padrón de miles de filas puede tardar medio minuto.
        </p>
      )}

      {state && 'total' in state && state.total !== undefined && (
        <div className="mt-3 space-y-1">
          <p className="text-green-400 text-sm font-medium">
            ✓ {state.total} direcciones leídas — {state.nuevas} nuevas, {state.repetidas} ya estaban cargadas
          </p>
          <p className="text-white/35 text-xs">
            {state.zonas} zona{state.zonas !== 1 ? 's' : ''} detectada{state.zonas !== 1 ? 's' : ''}
            {state.hojas.length > 0 && ` · hojas leídas: ${state.hojas.join(', ')}`}
          </p>
        </div>
      )}

      {state && 'error' in state && state.error && (
        <p className="mt-3 text-red-400 text-sm">{state.error}</p>
      )}
    </div>
  )
}
