import { getFaqs } from '@/lib/faqs'
import { addFaq, deleteFaq, moveFaq } from './actions'
import { DeleteButton } from '../components/DeleteButton'

const INPUT = "w-full bg-[#1a1a1a] border border-white/30 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/45"
const LABEL = "text-white/75 text-xs uppercase tracking-wide block mb-1.5 font-medium"

interface PageProps {
  searchParams: Promise<{ added?: string }>
}

export default async function FaqsPage({ searchParams }: PageProps) {
  const [faqs, params] = await Promise.all([getFaqs(), searchParams])
  const added = params.added === '1'

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-2">Preguntas Frecuentes</h1>
      <p className="text-white/40 text-sm mb-6">Administrá las preguntas que aparecen en la sección FAQ del sitio.</p>

      {added && (
        <div className="mb-5 px-4 py-3 bg-green-950/40 border border-green-700/40 text-green-400 text-sm">
          Pregunta agregada correctamente.
        </div>
      )}

      {/* Lista de FAQs */}
      <div className="flex flex-col gap-2 mb-8">
        {faqs.length === 0 && (
          <p className="text-white/30 text-sm py-6 text-center border border-white/10">Sin preguntas cargadas.</p>
        )}
        {faqs.map((faq, i) => (
          <div key={faq.id} className="border border-white/10 bg-[#131313] p-4 flex gap-3 items-start">
            {/* Orden */}
            <div className="flex flex-col gap-1 shrink-0">
              <form action={moveFaq.bind(null, faq.id, 'up')}>
                <button
                  type="submit"
                  disabled={i === 0}
                  className="text-white/30 hover:text-white disabled:opacity-20 text-xs px-1.5 py-0.5 border border-white/10 hover:border-white/30 transition-colors"
                >
                  ▲
                </button>
              </form>
              <form action={moveFaq.bind(null, faq.id, 'down')}>
                <button
                  type="submit"
                  disabled={i === faqs.length - 1}
                  className="text-white/30 hover:text-white disabled:opacity-20 text-xs px-1.5 py-0.5 border border-white/10 hover:border-white/30 transition-colors"
                >
                  ▼
                </button>
              </form>
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold">{faq.q}</p>
              <p className="text-white/50 text-xs mt-1 leading-relaxed">{faq.a}</p>
            </div>

            {/* Eliminar */}
            <DeleteButton
              action={deleteFaq.bind(null, faq.id)}
              label={`¿Eliminar "${faq.q}"?`}
            />
          </div>
        ))}
      </div>

      {/* Agregar */}
      <div className="border border-[#CC0000]/30 bg-[#131313] p-5">
        <p className="text-[#CC0000] font-bold uppercase tracking-wider text-xs mb-4">Agregar pregunta</p>
        <form action={addFaq} className="flex flex-col gap-3">
          <div>
            <label className={LABEL}>Pregunta *</label>
            <input
              name="q"
              required
              placeholder="¿Cuál es el horario de atención?"
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>Respuesta *</label>
            <textarea
              name="a"
              required
              rows={3}
              placeholder="Lunes a viernes de 8 a 18 hs..."
              className={`${INPUT} resize-none`}
            />
          </div>
          <button
            type="submit"
            className="self-start px-5 py-2 bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            + Agregar
          </button>
        </form>
      </div>
    </div>
  )
}
