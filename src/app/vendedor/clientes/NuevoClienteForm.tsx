'use client'

import { useState, useRef } from 'react'

const TIPOS_CLIENTE = [
  { value: 'potencial', label: 'Potencial', active: 'bg-white/10 border-white text-white', idle: 'border-white/30 text-white/60' },
  { value: 'minorista', label: 'Minorista', active: 'bg-[#CC0000]/20 border-[#CC0000] text-[#CC0000]', idle: 'border-[#CC0000]/40 text-[#CC0000]/60' },
  { value: 'mayorista', label: 'Mayorista', active: 'bg-[#F5C000]/20 border-[#F5C000] text-[#F5C000]', idle: 'border-[#F5C000]/40 text-[#F5C000]/60' },
]

const METODOS = ['WhatsApp', 'Llamada', 'En persona', 'Email']
const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const TIPOS_NEGOCIO = ['Almacén', 'Kiosco', 'Ferretería', 'Farmacia', 'Restaurante', 'Bar', 'Otro']
const STORAGE_KEY = 'vendedor_pending_clientes'

interface Props {
  action: (fd: FormData) => Promise<void>
  onCancel: () => void
  vendedorUsername: string
}

const INPUT = "w-full bg-[#1a1a1a] border border-white/20 text-white px-3 py-3 text-base focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/35"

export function NuevoClienteForm({ action, onCancel, vendedorUsername }: Props) {
  const [tipo, setTipo] = useState('potencial')
  const [metodo, setMetodo] = useState('')
  const [saving, setSaving] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData(formRef.current!)

    if (!navigator.onLine) {
      const pending = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
      pending.push({
        id: crypto.randomUUID(),
        nombre: fd.get('nombre'),
        tipo_negocio: fd.get('tipo_negocio'),
        contacto: fd.get('contacto'),
        telefono: fd.get('telefono'),
        direccion: fd.get('direccion'),
        horarios: fd.get('horarios'),
        dia_visita: fd.get('dia_visita'),
        metodo_contacto: fd.get('metodo_contacto'),
        zona_ruta: fd.get('zona_ruta'),
        tipo: fd.get('tipo'),
        nota: fd.get('nota'),
        vendedor: vendedorUsername,
        timestamp: Date.now(),
      })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pending))
      // Notify SyncPending component in the same tab
      window.dispatchEvent(new CustomEvent('offline-queue-updated'))
      onCancel()
      return
    }

    setSaving(true)
    try {
      await action(fd)
    } finally {
      // Resets if action throws; on redirect the component unmounts so this is harmless
      setSaving(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="hidden" name="vendedor" value={vendedorUsername} />

      <div>
        <label className="text-white/50 text-xs uppercase tracking-wide block mb-1.5">Zona / Ruta</label>
        <input name="zona_ruta" placeholder="Norte, Centro, Ruta 3..." className={INPUT} />
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="mb-4">
          <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Nombre / Razón Social *</label>
          <input name="nombre" required placeholder="Almacén Don Juan / Juan García" className={INPUT} />
        </div>

        <div className="mb-4">
          <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Tipo de negocio</label>
          <input name="tipo_negocio" placeholder="Almacén, Kiosco, Ferretería..."
            list="tipos-negocio-list" className={INPUT} />
          <datalist id="tipos-negocio-list">
            {TIPOS_NEGOCIO.map((t) => <option key={t} value={t} />)}
          </datalist>
        </div>

        <div className="mb-4">
          <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Tipo de cliente</label>
          <input type="hidden" name="tipo" value={tipo} />
          <div className="flex gap-2">
            {TIPOS_CLIENTE.map((t) => (
              <button key={t.value} type="button" onClick={() => setTipo(t.value)}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider border transition-colors ${tipo === t.value ? t.active : t.idle}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Contacto</label>
            <input name="contacto" placeholder="Nombre del dueño" className={INPUT} />
          </div>
          <div>
            <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Teléfono</label>
            <input name="telefono" type="tel" placeholder="11 1234-5678" className={INPUT} />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Dirección</label>
          <input name="direccion" placeholder="Av. Rivadavia 1234, local 5" className={INPUT} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Horarios</label>
            <input name="horarios" placeholder="Lun-Vie 8-18hs" className={INPUT} />
          </div>
          <div>
            <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Día de visita</label>
            <select name="dia_visita" className={`${INPUT} appearance-none`}>
              <option value="">— Elegir —</option>
              {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Método de contacto</label>
          <input type="hidden" name="metodo_contacto" value={metodo} />
          <div className="flex gap-2 flex-wrap">
            {METODOS.map((m) => (
              <button key={m} type="button" onClick={() => setMetodo(metodo === m ? '' : m)}
                className={`px-3 py-2 text-xs font-bold border transition-colors ${metodo === m ? 'bg-white/10 border-white text-white' : 'border-white/20 text-white/50 hover:text-white'}`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Observaciones</label>
          <textarea name="nota" rows={3}
            placeholder="Interesado en jabones, volver miércoles..."
            className={`${INPUT} resize-none`} />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={saving}
          className="flex-1 bg-[#CC0000] hover:bg-red-700 text-white font-bold uppercase tracking-wider py-3.5 text-sm transition-colors disabled:opacity-50">
          {saving ? 'Guardando...' : 'Guardar cliente'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-4 border border-white/20 text-white/50 hover:text-white text-sm transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  )
}
