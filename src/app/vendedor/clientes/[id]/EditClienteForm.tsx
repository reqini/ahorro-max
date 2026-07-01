'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Cliente } from '@/lib/clientes'

const TIPOS = ['potencial', 'minorista', 'mayorista'] as const
const ESTADOS = ['activo', 'inactivo'] as const
const METODOS = ['WhatsApp', 'Llamada', 'En persona', 'Email']
const DIAS = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const INPUT = "w-full bg-[#1a1a1a] border border-white/20 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/35"

export function EditClienteForm({
  cliente,
  updateAction,
}: {
  cliente: Cliente
  updateAction: (fd: FormData) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [tipo, setTipo] = useState(cliente.tipo)
  const [estado, setEstado] = useState(cliente.estado)
  const [metodo, setMetodo] = useState(cliente.metodo_contacto ?? '')
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await updateAction(new FormData(formRef.current!))
    setSaving(false)
    setEditing(false)
    router.refresh()
  }

  if (!editing) {
    return (
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 flex flex-col gap-2">
            {/* Contact actions */}
            {cliente.telefono && (
              <div className="flex items-center gap-3">
                <a href={`tel:${cliente.telefono}`}
                  className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm">
                  📞 <span className="font-semibold">{cliente.telefono}</span>
                </a>
                <a href={`https://wa.me/54${cliente.telefono.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(cliente.nombre)}!`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-[#25D366] text-sm font-bold hover:underline">
                  WhatsApp ↗
                </a>
              </div>
            )}
            {/* Info grid */}
            <div className="grid grid-cols-1 gap-1.5 text-sm text-white/50">
              {cliente.tipo_negocio && <p><span className="text-white/30 text-xs">Negocio:</span> <span className="text-white/70">{cliente.tipo_negocio}</span></p>}
              {cliente.contacto && <p><span className="text-white/30 text-xs">Contacto:</span> <span className="text-white/70">{cliente.contacto}</span></p>}
              {cliente.direccion && <p><span className="text-white/30 text-xs">Dirección:</span> {cliente.direccion}</p>}
              {cliente.horarios && <p><span className="text-white/30 text-xs">Horarios:</span> {cliente.horarios}</p>}
              {cliente.dia_visita && <p><span className="text-white/30 text-xs">Día de visita:</span> <span className="text-white/80 font-semibold">{cliente.dia_visita}</span></p>}
              {cliente.metodo_contacto && <p><span className="text-white/30 text-xs">Contactar por:</span> {cliente.metodo_contacto}</p>}
              {cliente.vendedor && <p><span className="text-white/30 text-xs">Vendedor:</span> {cliente.vendedor}</p>}
              {cliente.zona_ruta && <p><span className="text-white/30 text-xs">Zona/Ruta:</span> {cliente.zona_ruta}</p>}
              {!cliente.telefono && !cliente.direccion && !cliente.contacto && (
                <p className="text-white/25 italic text-xs">Sin datos de contacto</p>
              )}
            </div>
          </div>
          <button onClick={() => setEditing(true)}
            className="text-xs px-3 py-1.5 border border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors shrink-0">
            Editar
          </button>
        </div>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSave} className="px-4 py-4 border-b border-white/5 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Nombre *</label>
          <input name="nombre" required defaultValue={cliente.nombre} className={INPUT} />
        </div>
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Tipo negocio</label>
          <input name="tipo_negocio" defaultValue={cliente.tipo_negocio} placeholder="Almacén, Kiosco..." className={INPUT} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Contacto</label>
          <input name="contacto" defaultValue={cliente.contacto} className={INPUT} />
        </div>
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Teléfono</label>
          <input name="telefono" defaultValue={cliente.telefono} className={INPUT} />
        </div>
      </div>

      <div>
        <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Dirección</label>
        <input name="direccion" defaultValue={cliente.direccion} className={INPUT} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Horarios</label>
          <input name="horarios" defaultValue={cliente.horarios} placeholder="Lun-Vie 8-18hs" className={INPUT} />
        </div>
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Día visita</label>
          <select name="dia_visita" defaultValue={cliente.dia_visita} className={`${INPUT} appearance-none`}>
            {DIAS.map((d) => <option key={d} value={d}>{d || '— Elegir —'}</option>)}
          </select>
        </div>
      </div>

      {/* Método de contacto */}
      <div>
        <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Método de contacto</label>
        <input type="hidden" name="metodo_contacto" value={metodo} />
        <div className="flex gap-2 flex-wrap">
          {METODOS.map((m) => (
            <button key={m} type="button" onClick={() => setMetodo(metodo === m ? '' : m)}
              className={`px-2.5 py-1.5 text-xs border transition-colors ${metodo === m ? 'bg-white/10 border-white text-white' : 'border-white/20 text-white/40 hover:text-white'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Vendedor</label>
          <input name="vendedor" defaultValue={cliente.vendedor} className={INPUT} />
        </div>
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Zona / Ruta</label>
          <input name="zona_ruta" defaultValue={cliente.zona_ruta} className={INPUT} />
        </div>
      </div>

      {/* Tipo + Estado */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Tipo cliente</label>
          <input type="hidden" name="tipo" value={tipo} />
          <div className="flex flex-col gap-1">
            {TIPOS.map((t) => (
              <button key={t} type="button" onClick={() => setTipo(t)}
                className={`text-xs py-1.5 px-2 border text-left transition-colors ${tipo === t ? 'border-[#CC0000] bg-[#CC0000]/10 text-white' : 'border-white/20 text-white/40 hover:text-white'}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Estado</label>
          <input type="hidden" name="estado" value={estado} />
          <div className="flex flex-col gap-1">
            {ESTADOS.map((s) => (
              <button key={s} type="button" onClick={() => setEstado(s)}
                className={`text-xs py-1.5 px-2 border text-left transition-colors ${estado === s ? 'border-green-700 bg-green-950/30 text-green-400' : 'border-white/20 text-white/40 hover:text-white'}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={saving}
          className="flex-1 bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 transition-colors disabled:opacity-50">
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" onClick={() => setEditing(false)}
          className="px-4 border border-white/20 text-white/50 hover:text-white text-xs transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  )
}
