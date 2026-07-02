import type { TipoPrecio } from '../types'

interface Props {
  active: TipoPrecio
  onChange: (tipo: TipoPrecio) => void
  cartCountMinorista: number
  cartCountMayorista: number
}

export function TabBar({ active, onChange, cartCountMinorista, cartCountMayorista }: Props) {
  return (
    <div className="flex border-b border-white/8">
      <TabButton
        tipo="minorista"
        label="Minorista"
        active={active === 'minorista'}
        cartCount={cartCountMinorista}
        onClick={() => onChange('minorista')}
        activeColor="border-[#CC0000] text-white"
        countColor="bg-[#CC0000]"
      />
      <TabButton
        tipo="mayorista"
        label="Mayorista"
        active={active === 'mayorista'}
        cartCount={cartCountMayorista}
        onClick={() => onChange('mayorista')}
        activeColor="border-[#F5C000] text-[#F5C000]"
        countColor="bg-[#F5C000]"
      />
    </div>
  )
}

interface TabButtonProps {
  tipo: TipoPrecio
  label: string
  active: boolean
  cartCount: number
  onClick: () => void
  activeColor: string
  countColor: string
}

function TabButton({ label, active, cartCount, onClick, activeColor, countColor }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 flex items-center justify-center gap-2 h-11 text-sm font-black uppercase tracking-wider border-b-2 transition-colors ${
        active ? activeColor : 'border-transparent text-white/35'
      }`}
    >
      {label}
      {cartCount > 0 && (
        <span
          className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black text-black flex items-center justify-center ${countColor}`}
        >
          {cartCount}
        </span>
      )}
    </button>
  )
}
