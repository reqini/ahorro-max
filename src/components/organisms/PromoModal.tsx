'use client'

import { useEffect, useState, useRef } from 'react'
import type { PromoFlash } from '@/lib/promo'
import { WHATSAPP_NUMBER } from '@/constants'

export function PromoModal({ promo }: { promo: PromoFlash }) {
  const [visible, setVisible] = useState(false)
  const [countdown, setCountdown] = useState(promo.countdown_segundos)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!visible || promo.countdown_segundos <= 0) return
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { close(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [visible])

  function close() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setVisible(false)
  }

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(promo.cta_mensaje_wa)}`
  const progress = promo.countdown_segundos > 0 ? (countdown / promo.countdown_segundos) * 100 : 100

  if (!visible) return null

  return (
    <>
      {/* Overlay — solo visible en desktop para clic-fuera */}
      <div
        className="fixed inset-0 z-[9998] hidden sm:block"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
        onClick={close}
      />

      {/* Modal — full screen mobile / card centrado desktop */}
      <div
        className="fixed inset-0 z-[9999] flex flex-col sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md sm:max-h-[90vh] overflow-y-auto"
        style={{
          background: '#0e0e0e',
          borderTop: '3px solid #CC0000',
        }}
      >
        {/* Gradient bar top */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#CC0000] via-[#F5C000] to-[#CC0000] shrink-0" />

        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white font-bold bg-black/70 hover:bg-black/90 transition-colors text-lg leading-none rounded-full border-2 border-white/50 hover:border-white"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Image */}
        {promo.imagen_url && (
          <div className="w-full aspect-video overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={promo.imagen_url} alt={promo.titulo} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 px-6 py-10 sm:py-8">

          {/* Badge */}
          {promo.badge && (
            <span
              className="inline-block px-4 py-1.5 text-xs font-black uppercase tracking-widest text-black"
              style={{ background: '#F5C000' }}
            >
              {promo.badge}
            </span>
          )}

          {/* Tipo tags */}
          <div className="flex items-center justify-center gap-2">
            {(promo.tipo === 'minorista' || promo.tipo === 'ambos') && (
              <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white border border-[#CC0000] bg-[#CC0000]/20">
                Minorista
              </span>
            )}
            {(promo.tipo === 'mayorista' || promo.tipo === 'ambos') && (
              <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black bg-[#F5C000]">
                Mayorista
              </span>
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <h2
              className="text-3xl sm:text-4xl font-black uppercase text-white leading-none"
              style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif", textShadow: '0 2px 20px rgba(204,0,0,0.4)' }}
            >
              {promo.titulo}
            </h2>
            {promo.subtitulo && (
              <p className="text-white/65 text-base sm:text-sm">{promo.subtitulo}</p>
            )}
          </div>

          {/* Prices */}
          {(promo.precio_minorista || promo.precio_mayorista) && (
            <div className="flex flex-col items-center gap-2 w-full">
              {promo.precio_anterior && (
                <span className="text-white/35 text-lg line-through">{promo.precio_anterior}</span>
              )}
              <div className={`flex gap-4 w-full ${promo.precio_minorista && promo.precio_mayorista ? 'justify-center' : 'justify-center'}`}>
                {(promo.tipo === 'minorista' || promo.tipo === 'ambos') && promo.precio_minorista && (
                  <div className="flex flex-col items-center gap-1">
                    {promo.tipo === 'ambos' && (
                      <span className="text-[#CC0000] text-[10px] font-black uppercase tracking-widest">Minorista</span>
                    )}
                    <span
                      className="font-black leading-none"
                      style={{
                        fontSize: promo.tipo === 'ambos' ? 'clamp(2rem, 12vw, 3.5rem)' : 'clamp(3rem, 18vw, 5rem)',
                        color: '#FFFFFF',
                        fontFamily: "Impact, 'Arial Narrow', sans-serif",
                        textShadow: '0 0 30px rgba(204,0,0,0.5)',
                      }}
                    >
                      {promo.precio_minorista}
                    </span>
                  </div>
                )}
                {promo.tipo === 'ambos' && promo.precio_minorista && promo.precio_mayorista && (
                  <div className="w-px bg-white/15 self-stretch" />
                )}
                {(promo.tipo === 'mayorista' || promo.tipo === 'ambos') && promo.precio_mayorista && (
                  <div className="flex flex-col items-center gap-1">
                    {promo.tipo === 'ambos' && (
                      <span className="text-[#F5C000] text-[10px] font-black uppercase tracking-widest">Mayorista</span>
                    )}
                    <span
                      className="font-black leading-none"
                      style={{
                        fontSize: promo.tipo === 'ambos' ? 'clamp(2rem, 12vw, 3.5rem)' : 'clamp(3rem, 18vw, 5rem)',
                        color: '#F5C000',
                        fontFamily: "Impact, 'Arial Narrow', sans-serif",
                        textShadow: '0 0 30px rgba(245,192,0,0.4)',
                      }}
                    >
                      {promo.precio_mayorista}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CTA WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="w-full flex items-center justify-center gap-3 py-4 sm:py-3.5 font-black uppercase tracking-wider text-white text-base sm:text-sm transition-all hover:brightness-110 active:scale-95"
            style={{ background: '#25D366', boxShadow: '0 4px 30px rgba(37,211,102,0.4)' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {promo.cta_texto}
          </a>

          {/* Dismiss */}
          <button
            onClick={close}
            className="text-white/35 text-sm hover:text-white/65 transition-colors underline underline-offset-4"
          >
            No gracias, quizás más tarde
          </button>

          {/* Countdown text */}
          {promo.countdown_segundos > 0 && countdown > 0 && (
            <p className="text-white/25 text-xs">Cierra automáticamente en {countdown}s</p>
          )}
        </div>

        {/* Countdown bar — bottom */}
        {promo.countdown_segundos > 0 && (
          <div className="h-1.5 w-full bg-white/10 shrink-0">
            <div
              className="h-full bg-[#CC0000] transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </>
  )
}
