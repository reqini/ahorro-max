import Link from 'next/link'
import { getClientes } from '@/lib/clientes'
import { getVendedorUsername } from '@/lib/admin-auth'
import { addCliente } from './actions'
import { NuevoClienteDrawer } from './NuevoClienteDrawer'
import { OfflineBar } from './OfflineBar'
import { SyncPending } from './SyncPending'
import type { TipoCliente } from '@/lib/clientes'

const BADGE: Record<string, string> = {
  minorista: 'bg-[#CC0000]/20 text-[#CC0000] border border-[#CC0000]/40',
  mayorista: 'bg-[#F5C000]/20 text-[#F5C000] border border-[#F5C000]/40',
  potencial: 'bg-white/5 text-white/50 border border-white/20',
}

interface PageProps {
  searchParams: Promise<{ tipo?: string; q?: string }>
}

export default async function ClientesPage({ searchParams }: PageProps) {
  const [params, username] = await Promise.all([searchParams, getVendedorUsername()])
  const tipoFiltro = params.tipo as TipoCliente | undefined
  const busqueda = params.q

  const clientes = await getClientes({ tipo: tipoFiltro, busqueda })

  const counts = {
    total: clientes.length,
    minorista: clientes.filter((c) => c.tipo === 'minorista').length,
    mayorista: clientes.filter((c) => c.tipo === 'mayorista').length,
    potencial: clientes.filter((c) => c.tipo === 'potencial').length,
  }

  return (
    <div className="flex flex-col">
      <OfflineBar />
      <SyncPending />

      {/* Search + filters */}
      <div className="sticky top-[53px] z-30 bg-[#0d0d0d] border-b border-white/10 px-4 pt-3 pb-3 flex flex-col gap-2">
        <form method="GET" className="relative">
          <input
            name="q"
            defaultValue={busqueda}
            placeholder="Buscar cliente o negocio..."
            className="w-full bg-[#1a1a1a] border border-white/20 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/35 pr-10"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
            🔍
          </button>
        </form>

        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {[
            { label: `Todos (${counts.total})`, value: undefined },
            { label: `Minorista (${counts.minorista})`, value: 'minorista' },
            { label: `Mayorista (${counts.mayorista})`, value: 'mayorista' },
            { label: `Potencial (${counts.potencial})`, value: 'potencial' },
          ].map((f) => {
            const active = tipoFiltro === f.value
            return (
              <Link key={f.label}
                href={f.value ? `/vendedor/clientes?tipo=${f.value}${busqueda ? `&q=${busqueda}` : ''}` : `/vendedor/clientes${busqueda ? `?q=${busqueda}` : ''}`}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wide whitespace-nowrap border transition-colors ${active ? 'bg-[#CC0000] border-[#CC0000] text-white' : 'border-white/20 text-white/50 hover:text-white hover:border-white/40'}`}>
                {f.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Client list */}
      <div className="flex flex-col divide-y divide-white/5">
        {clientes.length === 0 && (
          <div className="px-4 py-16 text-center">
            <p className="text-white/30 text-sm">
              {busqueda ? `Sin resultados para "${busqueda}"` : 'Todavía no hay clientes. Agregá el primero con el botón +'}
            </p>
          </div>
        )}

        {clientes.map((c) => (
          <Link key={c.id} href={`/vendedor/clientes/${c.id}`}
            className="flex items-center gap-3 px-4 py-4 hover:bg-white/3 active:bg-white/5 transition-colors">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-base shrink-0 ${
              c.tipo === 'minorista' ? 'bg-[#CC0000]/20 text-[#CC0000]' :
              c.tipo === 'mayorista' ? 'bg-[#F5C000]/20 text-[#F5C000]' :
              'bg-white/5 text-white/40'
            }`}>
              {c.nombre.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white font-semibold text-sm truncate">{c.nombre}</p>
                <span className={`text-[10px] px-1.5 py-0.5 font-bold uppercase ${BADGE[c.tipo]}`}>
                  {c.tipo}
                </span>
                {c.estado === 'inactivo' && (
                  <span className="text-[10px] px-1.5 py-0.5 font-bold uppercase bg-white/5 text-white/30 border border-white/10">
                    Inactivo
                  </span>
                )}
              </div>
              {c.tipo_negocio && <p className="text-white/40 text-xs mt-0.5 truncate">{c.tipo_negocio}</p>}
              {c.telefono && <p className="text-white/30 text-xs truncate">{c.telefono}</p>}
            </div>

            <span className="text-white/20 text-lg shrink-0">›</span>
          </Link>
        ))}
      </div>

      <NuevoClienteDrawer action={addCliente} vendedorUsername={username ?? ''} />
    </div>
  )
}
