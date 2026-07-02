interface Props {
  open: boolean
  onClose: () => void
}

export function IOSInstallModal({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-base">Instalar en iPhone</h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white w-8 h-8 flex items-center justify-center text-2xl"
          >
            ×
          </button>
        </div>

        <p className="text-white/60 text-sm">
          Para instalar la app en tu iPhone, seguí estos pasos:
        </p>

        <ol className="space-y-3">
          {[
            { num: '1', text: 'Tocá el botón Compartir', icon: '⬆️' },
            { num: '2', text: 'Deslizá y tocá "Agregar a inicio"', icon: '➕' },
            { num: '3', text: 'Tocá "Agregar" arriba a la derecha', icon: '✅' },
          ].map((step) => (
            <li key={step.num} className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">{step.icon}</span>
              <span className="text-white/80 text-sm pt-0.5">{step.text}</span>
            </li>
          ))}
        </ol>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#F97316] text-white font-bold rounded-xl text-sm mt-2"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}
