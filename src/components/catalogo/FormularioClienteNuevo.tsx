'use client'

import type { DatosClienteRapido } from '@/app/vendedor/clientes/actions'

const INPUT =
  'w-full bg-[#1a1a1a] border border-white/20 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] placeholder-white/20'
const LABEL = 'text-white/50 text-xs uppercase tracking-wide block mb-1.5'

const TIPOS = [
  { value: 'potencial', label: 'Potencial', activo: 'bg-white/10 border-white text-white' },
  { value: 'minorista', label: 'Minorista', activo: 'bg-[#CC0000]/20 border-[#CC0000] text-[#CC0000]' },
  { value: 'mayorista', label: 'Mayorista', activo: 'bg-[#F5C000]/20 border-[#F5C000] text-[#F5C000]' },
] as const

const METODOS = ['WhatsApp', 'Llamada', 'En persona', 'Email']
const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const TIPOS_NEGOCIO = ['Almacén', 'Kiosco', 'Ferretería', 'Farmacia', 'Restaurante', 'Bar', 'Otro']

interface Props {
  nombre: string
  onNombre: (v: string) => void
  datos: DatosClienteRapido
  onDatos: (d: DatosClienteRapido) => void
  guardando: boolean
  onGuardar: () => void
  onCancelar: () => void
}

/**
 * Alta de cliente sin salir del pedido, con la misma ficha que pide la sección
 * Clientes: si el vendedor está frente al mostrador es el momento en que tiene
 * todos los datos a mano.
 */
export function FormularioClienteNuevo({
  nombre,
  onNombre,
  datos,
  onDatos,
  guardando,
  onGuardar,
  onCancelar,
}: Props) {
  const set = (campo: keyof DatosClienteRapido, valor: string) => onDatos({ ...datos, [campo]: valor })

  return (
    <div className="mt-3 border border-white/20 bg-[#111] p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-white text-sm font-semibold">Cliente nuevo</p>
        <button type="button" onClick={onCancelar} className="text-white/40 hover:text-white text-xs">
          Cancelar
        </button>
      </div>

      <div>
        <label className={LABEL}>Nombre / Razón social *</label>
        <input
          value={nombre}
          onChange={(e) => onNombre(e.target.value)}
          placeholder="Almacén Don Juan / Juan García"
          className={INPUT}
          autoFocus
        />
      </div>

      <div>
        <label className={LABEL}>Tipo de cliente</label>
        <div className="flex gap-2">
          {TIPOS.map((t) => {
            const activo = (datos.tipo ?? 'potencial') === t.value
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => set('tipo', t.value)}
                className={`flex-1 py-2 text-xs font-bold border transition-colors ${
                  activo ? t.activo : 'border-white/20 text-white/50'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className={LABEL}>Tipo de negocio</label>
        <input
          value={datos.tipo_negocio ?? ''}
          onChange={(e) => set('tipo_negocio', e.target.value)}
          placeholder="Almacén, Kiosco, Ferretería..."
          list="rubros-cliente"
          className={INPUT}
        />
        <datalist id="rubros-cliente">
          {TIPOS_NEGOCIO.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={LABEL}>Contacto</label>
          <input
            value={datos.contacto ?? ''}
            onChange={(e) => set('contacto', e.target.value)}
            placeholder="Nombre del dueño"
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Teléfono</label>
          <input
            value={datos.telefono ?? ''}
            onChange={(e) => set('telefono', e.target.value)}
            type="tel"
            inputMode="tel"
            placeholder="11 1234-5678"
            className={INPUT}
          />
        </div>
      </div>

      <div>
        <label className={LABEL}>Dirección</label>
        <input
          value={datos.direccion ?? ''}
          onChange={(e) => set('direccion', e.target.value)}
          placeholder="Av. Rivadavia 1234, local 5"
          className={INPUT}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={LABEL}>Horarios</label>
          <input
            value={datos.horarios ?? ''}
            onChange={(e) => set('horarios', e.target.value)}
            placeholder="Lun-Vie 8-18hs"
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Día de visita</label>
          <select
            value={datos.dia_visita ?? ''}
            onChange={(e) => set('dia_visita', e.target.value)}
            className={`${INPUT} appearance-none`}
          >
            <option value="">— Elegir —</option>
            {DIAS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={LABEL}>Zona / Ruta</label>
        <input
          value={datos.zona_ruta ?? ''}
          onChange={(e) => set('zona_ruta', e.target.value)}
          placeholder="Norte, Centro, Ruta 3..."
          className={INPUT}
        />
      </div>

      <div>
        <label className={LABEL}>Método de contacto</label>
        <div className="flex gap-2 flex-wrap">
          {METODOS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => set('metodo_contacto', datos.metodo_contacto === m ? '' : m)}
              className={`px-3 py-2 text-xs font-bold border transition-colors ${
                datos.metodo_contacto === m
                  ? 'bg-white/10 border-white text-white'
                  : 'border-white/20 text-white/50'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={LABEL}>Observaciones</label>
        <textarea
          value={datos.nota ?? ''}
          onChange={(e) => set('nota', e.target.value)}
          rows={2}
          placeholder="Interesado en jabones, volver miércoles..."
          className={INPUT}
        />
      </div>

      <button
        type="button"
        onClick={onGuardar}
        disabled={guardando || !nombre.trim()}
        className="w-full py-3 bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wide transition-colors disabled:opacity-40"
      >
        {guardando ? 'Guardando...' : 'Guardar cliente y seguir con el pedido'}
      </button>
    </div>
  )
}
