import { getPromoFlash } from '@/lib/promo'
import { savePromo } from './actions'

interface PageProps {
  searchParams: Promise<{ saved?: string }>
}

const INPUT = "w-full bg-[#1a1a1a] border border-white/30 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/45"
const LABEL = "text-white/75 text-xs uppercase tracking-wide block mb-1.5 font-medium"

export default async function PromoPage({ searchParams }: PageProps) {
  const [promo, params] = await Promise.all([getPromoFlash(), searchParams])
  const saved = params.saved === '1'

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-xl font-bold text-white">Promo Relámpago</h1>
        <span
          className={`text-xs font-bold uppercase px-3 py-1 ${
            promo.activa
              ? 'bg-green-950/50 border border-green-700/50 text-green-400'
              : 'bg-white/5 border border-white/20 text-white/40'
          }`}
        >
          {promo.activa ? '● Activa' : '○ Inactiva'}
        </span>
      </div>

      {saved && (
        <div className="mb-6 px-4 py-3 bg-green-950/40 border border-green-700/40 text-green-400 text-sm">
          Promo guardada correctamente.
        </div>
      )}

      <form action={savePromo} className="flex flex-col gap-6 max-w-xl">

        {/* Activa toggle */}
        <div className="border border-white/20 bg-[#131313] p-4 flex items-center justify-between">
          <div>
            <p className="text-white font-semibold text-sm">Mostrar promo al ingresar</p>
            <p className="text-white/40 text-xs mt-0.5">El modal aparece una vez por sesión</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="activa"
              value="1"
              defaultChecked={promo.activa}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-white/10 peer-checked:bg-[#CC0000] rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
          </label>
        </div>

        {/* Badge */}
        <div>
          <label className={LABEL}>Badge (texto sobre el título)</label>
          <input name="badge" className={INPUT} defaultValue={promo.badge} placeholder="Ej: ⚡ OFERTA RELÁMPAGO ⚡" />
        </div>

        {/* Título y subtítulo */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={LABEL}>Título principal *</label>
            <input name="titulo" required className={INPUT} defaultValue={promo.titulo} placeholder="Ej: Aceite x12 al mejor precio" />
          </div>
          <div>
            <label className={LABEL}>Subtítulo</label>
            <input name="subtitulo" className={INPUT} defaultValue={promo.subtitulo} placeholder="Ej: Solo por hoy, stock limitado" />
          </div>
        </div>

        {/* Imagen */}
        <div>
          <label className={LABEL}>URL de imagen (opcional)</label>
          <input name="imagen_url" type="url" className={INPUT} defaultValue={promo.imagen_url} placeholder="https://..." />
          <p className="text-white/30 text-xs mt-1">Pegá la URL de una imagen. Se muestra arriba del texto.</p>
        </div>

        {/* Tipo de oferta */}
        <div className="border border-white/10 bg-[#0d0d0d] p-4 flex flex-col gap-3">
          <p className="text-white/50 text-xs uppercase tracking-wide font-bold">Tipo de oferta</p>
          <div className="flex gap-3">
            {(['minorista', 'mayorista', 'ambos'] as const).map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipo"
                  value={t}
                  defaultChecked={promo.tipo === t}
                  className="accent-[#CC0000]"
                />
                <span className={`text-sm font-bold uppercase ${
                  t === 'minorista' ? 'text-[#CC0000]' : t === 'mayorista' ? 'text-[#F5C000]' : 'text-white/60'
                }`}>
                  {t === 'ambos' ? 'Ambos' : t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Precios */}
        <div className="flex flex-col gap-3">
          <label className={LABEL}>Precio anterior / tachado (opcional)</label>
          <input name="precio_anterior" className={INPUT} defaultValue={promo.precio_anterior} placeholder="Ej: $2500" />
          <div className="grid grid-cols-2 gap-4 mt-1">
            <div>
              <label className={`${LABEL} text-[#CC0000]/80`}>Precio Minorista</label>
              <input name="precio_minorista" className={INPUT} defaultValue={promo.precio_minorista} placeholder="Ej: $1499" />
            </div>
            <div>
              <label className={`${LABEL} text-[#F5C000]/80`}>Precio Mayorista</label>
              <input name="precio_mayorista" className={INPUT} defaultValue={promo.precio_mayorista} placeholder="Ej: $1199" />
            </div>
          </div>
          <p className="text-white/25 text-xs">Completá solo los precios del tipo de oferta seleccionado, o ambos si aplica.</p>
        </div>

        {/* CTA */}
        <div className="border border-white/10 bg-[#0d0d0d] p-4 flex flex-col gap-4">
          <p className="text-white/50 text-xs uppercase tracking-wide font-bold">Botón WhatsApp</p>
          <div>
            <label className={LABEL}>Texto del botón</label>
            <input name="cta_texto" required className={INPUT} defaultValue={promo.cta_texto} placeholder="Ej: ¡Quiero esta oferta!" />
          </div>
          <div>
            <label className={LABEL}>Mensaje de WhatsApp</label>
            <textarea
              name="cta_mensaje_wa"
              rows={3}
              className={`${INPUT} resize-none`}
              defaultValue={promo.cta_mensaje_wa}
              placeholder="Ej: Hola! Vi la oferta relámpago y quiero aprovecharla 🔥"
            />
          </div>
        </div>

        {/* Countdown */}
        <div>
          <label className={LABEL}>Cierre automático (segundos)</label>
          <input
            name="countdown_segundos"
            type="number"
            min="0"
            max="300"
            className={INPUT}
            defaultValue={promo.countdown_segundos}
            placeholder="0 = sin cierre automático"
          />
          <p className="text-white/30 text-xs mt-1">0 = el usuario cierra manualmente. Ej: 30 = se cierra solo en 30 seg.</p>
        </div>

        <button
          type="submit"
          className="self-start px-6 py-2.5 bg-[#CC0000] hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wider transition-colors"
        >
          Guardar promo
        </button>
      </form>
    </div>
  )
}
