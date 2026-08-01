'use client'

import { useRef, useState } from 'react'
import { linkWhatsAppComprobante, moneda, telefonoAWhatsApp, type DatosComprobante } from '@/lib/comprobante'
import { FirmaCanvas, type FirmaCanvasHandle } from './FirmaCanvas'
import { guardarFirmaAction, marcarEnviadoAction } from './actions'

interface Props {
  pedidoId: string
  pedido: DatosComprobante
  telefonoInicial?: string
  onListo: () => void
}

/**
 * Paso posterior a crear el pedido: dejarle constancia al cliente. Se le manda el
 * comprobante por WhatsApp y, si no tiene, firma en el celular del vendedor para
 * que quede asentado qué pidió y a qué precio.
 */
export function ComprobantePedido({ pedidoId, pedido, telefonoInicial = '', onListo }: Props) {
  const [telefono, setTelefono] = useState(telefonoInicial)
  const [modo, setModo] = useState<'elegir' | 'firmar'>('elegir')
  const [hayTrazo, setHayTrazo] = useState(false)
  const [aclaracion, setAclaracion] = useState(pedido.cliente_nombre)
  const [guardando, setGuardando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [firmado, setFirmado] = useState(false)
  const [error, setError] = useState('')
  const firmaRef = useRef<FirmaCanvasHandle | null>(null)

  const numeroValido = telefonoAWhatsApp(telefono) !== ''

  function enviarPorWhatsApp() {
    // Se abre WhatsApp con el mensaje ya escrito: el vendedor solo toca enviar.
    window.open(linkWhatsAppComprobante(telefono, pedido), '_blank', 'noopener')
    setEnviado(true)
    void marcarEnviadoAction(pedidoId, telefono)
  }

  async function guardarFirma() {
    const dataUrl = firmaRef.current?.aDataURL()
    if (!dataUrl || !hayTrazo) {
      setError('Pedile al cliente que firme en el recuadro')
      return
    }

    setError('')
    setGuardando(true)
    const res = await guardarFirmaAction(pedidoId, dataUrl, aclaracion)
    setGuardando(false)

    if (res.error) {
      setError(res.error)
      return
    }
    setFirmado(true)
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-[60] flex flex-col">
      <div className="px-4 py-3 border-b border-white/10 shrink-0">
        <p className="text-green-400 font-bold text-base">✓ Pedido registrado</p>
        <p className="text-white/40 text-xs mt-0.5">
          {pedido.numero ? `N° ${pedido.numero} · ` : ''}
          {pedido.cliente_nombre || 'Sin nombre'} · Total {moneda(pedido.total_estimado)}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {modo === 'elegir' ? (
          <>
            <div>
              <p className="text-white font-semibold text-sm mb-1">Mandale la copia al cliente</p>
              <p className="text-white/35 text-xs mb-3">
                Se abre WhatsApp con el detalle del pedido escrito. Solo tenés que tocar enviar.
              </p>

              <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">
                WhatsApp del cliente
              </label>
              <input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                type="tel"
                inputMode="tel"
                placeholder="11 5020-3114"
                className="w-full bg-[#1a1a1a] border border-white/25 text-white text-base px-3 py-3 focus:outline-none focus:border-[#CC0000] placeholder-white/30"
              />
              {telefono && !numeroValido && (
                <p className="text-amber-400/80 text-xs mt-1.5">
                  Faltan dígitos. Escribí el número con característica, por ejemplo 11 5020-3114.
                </p>
              )}

              <button
                type="button"
                onClick={enviarPorWhatsApp}
                disabled={!numeroValido}
                className="w-full mt-3 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-black text-sm font-bold uppercase tracking-wide transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {enviado ? '✓ Enviado — abrir de nuevo' : 'Enviar por WhatsApp'}
              </button>
            </div>

            <div className="flex items-center gap-3 py-1">
              <span className="flex-1 h-px bg-white/10" />
              <span className="text-white/25 text-[11px] uppercase tracking-widest">o</span>
              <span className="flex-1 h-px bg-white/10" />
            </div>

            <div>
              <p className="text-white font-semibold text-sm mb-1">El cliente no tiene WhatsApp</p>
              <p className="text-white/35 text-xs mb-3">
                Que firme en tu celular y queda asentado el pedido y el precio acordado.
              </p>
              <button
                type="button"
                onClick={() => setModo('firmar')}
                className="w-full py-4 border border-white/25 text-white text-sm font-bold uppercase tracking-wide active:bg-white/10 transition-colors"
              >
                ✍ Firmar en pantalla
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-white font-semibold text-sm">Firma del cliente</p>
              <p className="text-white/35 text-xs mt-0.5 mb-3">
                Pasale el celular. Al firmar acepta el pedido y el total de {moneda(pedido.total_estimado)}.
              </p>
            </div>

            {firmado ? (
              <div className="border border-green-700/50 bg-green-950/20 px-4 py-6 text-center">
                <p className="text-green-400 font-bold text-sm">✓ Firma guardada</p>
                <p className="text-white/40 text-xs mt-1">Quedó adjunta al pedido.</p>
              </div>
            ) : (
              <>
                <FirmaCanvas ref={firmaRef} onCambio={setHayTrazo} />

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => firmaRef.current?.limpiar()}
                    className="text-white/40 hover:text-white text-xs underline"
                  >
                    Borrar y firmar de nuevo
                  </button>
                  <span className="text-white/25 text-[11px]">
                    {hayTrazo ? 'Firma lista' : 'Firmá con el dedo'}
                  </span>
                </div>

                <div>
                  <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">
                    Aclaración
                  </label>
                  <input
                    value={aclaracion}
                    onChange={(e) => setAclaracion(e.target.value)}
                    placeholder="Nombre de quien firma"
                    className="w-full bg-[#1a1a1a] border border-white/25 text-white text-base px-3 py-3 focus:outline-none focus:border-[#CC0000] placeholder-white/30"
                  />
                </div>

                <button
                  type="button"
                  onClick={guardarFirma}
                  disabled={guardando || !hayTrazo}
                  className="w-full py-4 bg-[#CC0000] hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wide transition-colors disabled:opacity-30"
                >
                  {guardando ? 'Guardando...' : 'Guardar firma'}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setModo('elegir')}
              className="w-full text-white/35 hover:text-white text-xs py-2"
            >
              ← Volver
            </button>
          </>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      <div className="px-4 py-3 border-t border-white/10 shrink-0">
        <button
          type="button"
          onClick={onListo}
          className="w-full py-3 border border-white/20 text-white/70 text-sm font-bold uppercase tracking-wide active:bg-white/10 transition-colors"
        >
          {enviado || firmado ? 'Listo' : 'Omitir por ahora'}
        </button>
      </div>
    </div>
  )
}
