import Link from 'next/link'
import { WHATSAPP_MINORISTA_URL } from '@/constants'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-5 text-center">
      <div className="flex flex-col items-center gap-6 max-w-md">
        <span className="text-[#CC0000] font-black text-6xl tracking-tight">404</span>
        <div>
          <h1 className="text-white text-xl font-bold mb-2">Esta página no existe</h1>
          <p className="text-white/50 text-sm">
            El link que seguiste puede estar roto o la página se movió. Probá alguna de estas opciones.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/"
            className="w-full py-3.5 bg-[#CC0000] hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wide transition-colors"
          >
            Ir al inicio
          </Link>
          <Link
            href="/catalogo"
            className="w-full py-3.5 border border-white/20 text-white hover:border-white/40 text-sm font-bold uppercase tracking-wide transition-colors"
          >
            🛒 Ver catálogo
          </Link>
          <a
            href={WHATSAPP_MINORISTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm font-bold uppercase tracking-wide transition-colors"
          >
            Consultanos por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
