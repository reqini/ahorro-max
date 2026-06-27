import { getSiteConfig } from '@/lib/config'
import { PreciosForm } from './PreciosForm'

export default async function PreciosPage() {
  const config = await getSiteConfig()

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-2">Listas de Precios</h1>
      <p className="text-white/40 text-sm mb-6">
        Subí los catálogos en PDF. Se guardan en Supabase Storage (bucket: listas-precios).
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PreciosForm
          tipo="minorista"
          label="Lista Minorista"
          currentUrl={config.lista_minorista_url ?? ''}
        />
        <PreciosForm
          tipo="mayorista"
          label="Lista Mayorista"
          currentUrl={config.lista_mayorista_url ?? ''}
        />
      </div>
    </div>
  )
}
