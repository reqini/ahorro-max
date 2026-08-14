import { SOCIAL_LINKS } from '@/constants'

/** Bloque simple anunciando el local físico en Ciudadela. */
export function ProximamenteLocal() {
  return (
    <section className="bg-[#0a0a0a] border-y border-white/10 py-10 md:py-14">
      <div className="max-w-2xl mx-auto px-5 text-center">
        <span className="text-[#F5C000] text-xs font-bold uppercase tracking-[0.25em]">
          Próximamente
        </span>
        <p className="text-white text-lg md:text-xl font-bold mt-2 leading-snug">
          Estamos preparando un local en Ciudadela.
        </p>
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 text-[#F5C000] hover:text-[#ffd400] font-bold text-sm transition-colors border-b border-[#F5C000]/40 hover:border-[#ffd400] pb-0.5"
        >
          Sumate a las novedades en Instagram →
        </a>
      </div>
    </section>
  )
}
