'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export interface FirmaCanvasHandle {
  aDataURL: () => string
  limpiar: () => void
}

interface Props {
  onCambio: (hayTrazo: boolean) => void
}

/**
 * Pad de firma para que el cliente firme con el dedo en el celular del vendedor.
 * Usa pointer events, así funciona igual con dedo, lápiz o mouse.
 */
export const FirmaCanvas = forwardRef<FirmaCanvasHandle, Props>(function FirmaCanvas(
  { onCambio },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dibujando = useRef(false)
  const hayTrazo = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // El canvas se dibuja a la resolución real de la pantalla para que la firma
    // no salga pixelada en celulares con densidad alta.
    const escala = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * escala
    canvas.height = rect.height * escala

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(escala, escala)
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#111'
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, rect.width, rect.height)
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      aDataURL: () => canvasRef.current?.toDataURL('image/png') ?? '',
      limpiar: () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return
        const rect = canvas.getBoundingClientRect()
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, rect.width, rect.height)
        hayTrazo.current = false
        onCambio(false)
      },
    }),
    [onCambio]
  )

  function posicion(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function empezar(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dibujando.current = true
    const { x, y } = posicion(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function mover(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!dibujando.current) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = posicion(e)
    ctx.lineTo(x, y)
    ctx.stroke()

    if (!hayTrazo.current) {
      hayTrazo.current = true
      onCambio(true)
    }
  }

  function terminar() {
    dibujando.current = false
  }

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={empezar}
      onPointerMove={mover}
      onPointerUp={terminar}
      onPointerLeave={terminar}
      onPointerCancel={terminar}
      className="w-full h-40 bg-white border border-white/20 touch-none cursor-crosshair"
    />
  )
})
