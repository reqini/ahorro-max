'use client'

import { useEffect, useState, useRef } from 'react'
import type { PromoFlash } from '@/lib/promo'
import { WHATSAPP_NUMBER } from '@/constants'

const SESSION_KEY = 'promo_flash_closed'

export function PromoModal({ promo }: { promo: PromoFlash }) {
  const [visible, setVisible] = useState(false)
  const [countdown, setCountdown] = useState(promo.countdown_segundos)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return
    // Small delay so the page loads first
    const t = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!visible || promo.countdown_segundos <= 0) return
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          close()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [visible])

  function close() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setVisible(false)
    sessionStorage.setItem(SESSION_KEY, '1')
  }

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(promo.cta_mensaje_wa)}`
  const progress = promo.countdown_segundos > 0
    ? (countdown / promo.countdown_segundos) * 100
    : 100

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <div
        className="relative w-full max-w-md overflow-hidden shadow-2xl"
        style={{ background: '#0e0e0e', border: '1px solid rgba(204,0,0,0.4)' }}
      >
        {/* Top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#CC0000] via-[#F5C000] to-[#CC0000]" />

        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors text-lg leading-none"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Image */}
        {promo.imagen_url && (
          <div className="w-full aspect-video relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={promo.imagen_url}
              alt={promo.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="px-6 pt-5 pb-6 flex flex-col items-center text-center gap-4">

          {/* Badge */}
          {promo.badge && (
            <span
              className="inline-block px-4 py-1.5 text-xs font-black uppercase tracking-widest text-black"
              style={{ background: '#F5C000' }}
            >
              {promo.badge}
            </span>
          )}

          {/* Title */}
          <div>
            <h2
              className="text-3xl md:text-4xl font-black uppercase text-white leading-none"
              style={{ fontFamily: "Impact, 'Arial Narrow', sans-serif", textShadow: '0 2px 20px rgba(204,0,0,0.4)' }}
            >
              {promo.titulo}
            </h2>
            {promo.subtitulo && (
              <p className="mt-2 text-white/65 text-sm">{promo.subtitulo}</p>
            )}
          </div>

          {/* Price */}
          {promo.precio && (
            <div className="flex flex-col items-center gap-1">
              {promo.precio_anterior && (
                <span className="text-white/35 text-lg line-through">{promo.precio_anterior}</span>
              )}
              <span
                className="text-5xl md:text-6xl font-black leading-none"
                style={{
                  color: '#CC0000',
                  fontFamily: "Impact, 'Arial Narrow', sans-serif",
                  textShadow: '0 0 40px rgba(204,0,0,0.5)',
                }}
              >
                {promo.precio}
              </span>
            </div>
          )}

          {/* CTA */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="w-full flex items-center justify-center gap-2.5 py-4 font-black uppercase tracking-wider text-white text-base transition-all hover:brightness-110 active:scale-95"
            style={{ background: '#25D366', boxShadow: '0 4px 24px rgba(37,211,102,0.35)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {promo.cta_texto}
          </a>

          {/* Dismiss */}
          <button
            onClick={close}
            className="text-white/30 text-xs hover:text-white/60 transition-colors underline underline-offset-2"
          >
            No gracias, quizás más tarde
          </button>
        </div>

        {/* Countdown bar */}
        {promo.countdown_segundos > 0 && (
          <div className="h-1 w-full bg-white/10">
            <div
              className="h-full bg-[#CC0000] transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
