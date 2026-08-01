'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ESTADOS_PARADA, type EstadoParada, type Parada } from '@/lib/recorridos'
import { formatearDistancia } from '@/lib/ruta'

const ALTO_ASOMADA = 178

const COLOR_ESTADO: Record<EstadoParada, string> = {
  pendiente: 'border-white/20 text-white/45',
  visitada: 'border-green-700/60 text-green-400 bg-green-950/40',
  no_atendio: 'border-[#F5C000]/50 text-[#F5C000] bg-[#F5C000]/10',
  cerrado: 'border-white/25 text-white/50 bg-white/5',
}

interface Props {
  paradas: Parada[]
  proxima: Parada | null
  /** Distancia en metros del vendedor a la próxima parada; null si no hay GPS. */
  metrosAProxima: number | null
  /** Marcas hechas sin señal, todavía sin llegar al servidor. */
  sinSincronizar: number
  onMarcar: (parada: Parada, estado: EstadoParada) => void
  onConfirmarVisita: (parada: Parada) => void
  onNota: (parada: Parada, nota: string) => void
  onIrA: (parada: Parada) => void
  pie: React.ReactNode
}

export function HojaParadas({
  paradas,
  proxima,
  metrosAProxima,
  sinSincronizar,
  onMarcar,
  onConfirmarVisita,
  onNota,
  onIrA,
  pie,
}: Props) {
  const [alto, setAlto] = useState(ALTO_ASOMADA)
  const [soloPendientes, setSoloPendientes] = useState(false)
  const arrastre = useRef<{ inicioY: number; altoInicial: number; movio: boolean } | null>(null)
  const contenedor = useRef<HTMLDivElement>(null)

  const topes = useCallback(() => {
    const disponible = contenedor.current?.parentElement?.clientHeight ?? 600
    return [ALTO_ASOMADA, Math.round(disponible * 0.5), Math.round(disponible * 0.9)]
  }, [])

  // Si la ventana cambia de tamaño (rotar el celular), el tope de arriba cambia.
  useEffect(() => {
    function alRedimensionar() {
      const t = topes()
      setAlto((a) => Math.min(a, t[2]))
    }
    window.addEventListener('resize', alRedimensionar)
    return () => window.removeEventListener('resize', alRedimensionar)
  }, [topes])

  function alTomar(e: React.PointerEvent) {
    arrastre.current = { inicioY: e.clientY, altoInicial: alto, movio: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function alMover(e: React.PointerEvent) {
    const gesto = arrastre.current
    if (!gesto) return

    const desplazamiento = gesto.inicioY - e.clientY
    if (Math.abs(desplazamiento) > 4) gesto.movio = true

    const t = topes()
    // Arrastrar hacia arriba (clientY menor) agranda la hoja.
    setAlto(Math.min(Math.max(gesto.altoInicial + desplazamiento, 64), t[2]))
  }

  function alSoltar() {
    const gesto = arrastre.current
    if (!gesto) return
    arrastre.current = null

    // setPointerCapture impide que llegue el `click`, así que el toque simple se
    // resuelve acá: si el dedo no se movió, es un tap y alterna el tamaño.
    if (!gesto.movio) {
      alternarTamano(gesto.altoInicial)
      return
    }

    const t = topes()
    // Al soltar, se acomoda al tope más cercano.
    setAlto((actual) =>
      t.reduce((mejor, tope) => (Math.abs(tope - actual) < Math.abs(mejor - actual) ? tope : mejor), t[0])
    )
  }

  function alternarTamano(desde = alto) {
    const t = topes()
    setAlto(desde <= ALTO_ASOMADA + 20 ? t[1] : ALTO_ASOMADA)
  }

  const hechas = paradas.filter((p) => p.estado !== 'pendiente').length
  const visibles = soloPendientes ? paradas.filter((p) => p.estado === 'pendiente') : paradas
  const expandida = alto > ALTO_ASOMADA + 20

  return (
    <div
      ref={contenedor}
      style={{ height: alto }}
      className="absolute inset-x-0 bottom-0 z-[1100] bg-[#0d0d0d] border-t-2 border-[#CC0000]/50 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.85)] flex flex-col touch-none"
    >
      {/* Zona de arrastre */}
      <div
        onPointerDown={alTomar}
        onPointerMove={alMover}
        onPointerUp={alSoltar}
        onPointerCancel={alSoltar}
        className="shrink-0 cursor-grab active:cursor-grabbing"
      >
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') alternarTamano()
          }}
          className="w-full pt-2 pb-2 flex flex-col items-center gap-1.5 select-none"
          aria-label={expandida ? 'Contraer lista' : 'Desplegar lista'}
        >
          <span className="w-12 h-1.5 rounded-full bg-white/40" />
          <span className="text-[10px] uppercase tracking-widest text-white/45 font-bold">
            {expandida ? '▼ Ocultar paradas' : `▲ Ver las ${paradas.length} paradas`}
          </span>
        </div>

        {/* Próxima parada: lo único que importa mientras camina */}
        <div className="px-4 pb-3">
          {proxima ? (
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 shrink-0 border border-[#CC0000]/60 bg-[#CC0000]/15 text-white flex items-center justify-center text-sm font-bold">
                {proxima.orden + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-white/35 font-bold">Próxima parada</p>
                <p className="text-white text-sm font-semibold truncate">{proxima.direccion}</p>
                <p className="text-white/40 text-[11px]">
                  {metrosAProxima != null
                    ? `a ${formatearDistancia(metrosAProxima)} de donde estás`
                    : `${hechas} de ${paradas.length} paradas hechas`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onConfirmarVisita(proxima)}
                className="shrink-0 px-3 py-2 bg-green-700 hover:bg-green-600 text-white text-xs font-bold uppercase tracking-wide transition-colors"
              >
                ✓ Visité
              </button>
            </div>
          ) : (
            <p className="text-green-400 text-sm font-medium py-1">
              ✓ Recorrido terminado — {paradas.length} paradas
            </p>
          )}
        </div>
      </div>

      {/* Listado completo */}
      <div className="flex-1 overflow-y-auto overscroll-contain touch-auto border-t border-white/10">
        <div className="px-4 py-2.5 flex items-center justify-between gap-3 sticky top-0 bg-[#0d0d0d] z-10">
          <span className="text-white/40 text-[11px] uppercase tracking-wide font-bold">
            {hechas} de {paradas.length} hechas
            {sinSincronizar > 0 && (
              <span className="text-[#F5C000] normal-case font-medium">
                {' '}· {sinSincronizar} sin sincronizar
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={() => setSoloPendientes((v) => !v)}
            className={`text-[11px] px-2.5 py-1 border transition-colors ${
              soloPendientes
                ? 'bg-[#CC0000]/15 border-[#CC0000]/60 text-white'
                : 'border-white/15 text-white/45'
            }`}
          >
            Solo pendientes
          </button>
        </div>

        {visibles.length === 0 ? (
          <p className="text-white/25 text-sm text-center py-8">No quedan paradas pendientes.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {visibles.map((parada) => (
              <div key={parada.id} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => onIrA(parada)}
                    className={`w-7 h-7 shrink-0 border flex items-center justify-center text-xs font-bold transition-colors ${COLOR_ESTADO[parada.estado]}`}
                    aria-label={`Ver parada ${parada.orden + 1} en el mapa`}
                  >
                    {parada.orden + 1}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        parada.estado === 'pendiente' ? 'text-white' : 'text-white/45 line-through'
                      }`}
                    >
                      {parada.direccion}
                    </p>
                    <p className="text-white/30 text-[11px] mt-0.5">
                      {parada.zona}
                      {parada.metros_desde_anterior > 0 &&
                        ` · ${formatearDistancia(parada.metros_desde_anterior)} desde la anterior`}
                      {parada.lat == null && ' · sin ubicación'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1.5 mt-2 pl-10">
                  {ESTADOS_PARADA.filter((e) => e.valor !== 'pendiente').map((e) => (
                    <button
                      key={e.valor}
                      type="button"
                      onClick={() => onMarcar(parada, e.valor)}
                      className={`flex-1 text-[11px] py-2 border transition-colors ${
                        parada.estado === e.valor
                          ? COLOR_ESTADO[e.valor]
                          : 'border-white/12 text-white/40 active:bg-white/10'
                      }`}
                    >
                      {e.corto} {e.label}
                    </button>
                  ))}
                </div>

                {/* Comentario opcional: queda siempre a la vista para que el vendedor
                    pueda dejar la aclaración antes de pasar a la parada siguiente. */}
                <div className="pl-10 mt-1.5">
                  <textarea
                    defaultValue={parada.nota}
                    onBlur={(e) => {
                      if (e.target.value !== parada.nota) onNota(parada, e.target.value)
                    }}
                    placeholder="Comentario, aclaración o dato extra (opcional)"
                    maxLength={500}
                    rows={1}
                    className="w-full bg-[#151515] border border-white/12 text-white text-xs px-3 py-2 focus:outline-none focus:border-[#CC0000] focus:bg-[#1a1a1a] placeholder-white/25 resize-y min-h-[36px] transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="px-4 py-4 border-t border-white/10 mt-2">{pie}</div>
      </div>
    </div>
  )
}
