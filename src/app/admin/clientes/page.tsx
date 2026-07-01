export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getClientes } from '@/lib/clientes'
import type { TipoCliente } from '@/lib/clientes'

const BADGE: Record<string, string> = {
  minorista: 'bg-[#CC0000]/20 text-[#CC0000] border border-[#CC0000]/40',
  mayorista: 'bg-[#F5C000]/20 text-[#F5C000] border border-[#F5C000]/40',
  potencial: 'bg-white/5 text-white/50 border border-white/20',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

interface PageProps {
  searchParams: Promise<{ tipo?: string; q?: string }>
}

export default async function AdminClientesPage({ searchParams }: PageProps) {
  const params = await searchParams
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
    <div>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white">Clientes / Lista Digital</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Datos cargados por los vendedores — actualización en tiempo real
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <span className="text-white/30 text-sm">{counts.total} clientes</span>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <form method="GET" className="flex gap-2 flex-1">
          <input name="q" defaultValue={busqueda}
            placeholder="Buscar por nombre..."
            className="flex-1 bg-[#1a1a1a] border border-white/20 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/30"
          />
          {tipoFiltro && <input type="hidden" name="tipo" value={tipoFiltro} />}
          <button type="submit" className="px-4 py-2 bg-white/5 border border-white/20 text-white/70 text-sm hover:text-white transition-colors">
            Buscar
          </button>
        </form>
        <div className="flex gap-1.5 flex-wrap">
          {[
            { label: `Todos (${counts.total})`, value: undefined },
            { label: `Minorista (${counts.minorista})`, value: 'minorista' },
            { label: `Mayorista (${counts.mayorista})`, value: 'mayorista' },
            { label: `Potencial (${counts.potencial})`, value: 'potencial' },
          ].map((f) => (
            <Link key={f.label}
              href={f.value ? `/admin/clientes?tipo=${f.value}${busqueda ? `&q=${busqueda}` : ''}` : `/admin/clientes${busqueda ? `?q=${busqueda}` : ''}`}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide border transition-colors ${tipoFiltro === f.value ? 'bg-[#CC0000] border-[#CC0000] text-white' : 'border-white/20 text-white/40 hover:text-white hover:border-white/40'}`}>
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      {clientes.length === 0 ? (
        <div className="py-20 text-center text-white/30 text-sm">
          {busqueda ? `Sin resultados para "${busqueda}"` : 'Todavía no hay clientes cargados.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/30 text-xs uppercase tracking-wider">
                <th className="py-2 px-3 text-left font-medium">Nombre / Negocio</th>
                <th className="py-2 px-3 text-left font-medium">Tipo</th>
                <th className="py-2 px-3 text-left font-medium">Contacto</th>
                <th className="py-2 px-3 text-left font-medium">Teléfono</th>
                <th className="py-2 px-3 text-left font-medium">Dirección</th>
                <th className="py-2 px-3 text-left font-medium">Día visita</th>
                <th className="py-2 px-3 text-left font-medium">Método</th>
                <th className="py-2 px-3 text-left font-medium">Vendedor</th>
                <th className="py-2 px-3 text-left font-medium">Zona</th>
                <th className="py-2 px-3 text-left font-medium">Estado</th>
                <th className="py-2 px-3 text-left font-medium">Alta</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/3 transition-colors group">
                  <td className="py-2.5 px-3">
                    <Link href={`/vendedor/clientes/${c.id}`}
                      className="text-white font-semibold hover:text-[#CC0000] transition-colors">
                      {c.nombre}
                    </Link>
                    {c.tipo_negocio && <p className="text-white/30 text-xs">{c.tipo_negocio}</p>}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] px-2 py-0.5 font-bold uppercase ${BADGE[c.tipo]}`}>
                      {c.tipo}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-white/60">{c.contacto || '—'}</td>
                  <td className="py-2.5 px-3">
                    {c.telefono
                      ? <a href={`tel:${c.telefono}`} className="text-white/70 hover:text-white transition-colors">{c.telefono}</a>
                      : <span className="text-white/20">—</span>}
                  </td>
                  <td className="py-2.5 px-3 text-white/50 max-w-[160px] truncate">{c.direccion || '—'}</td>
                  <td className="py-2.5 px-3 text-white/60">{c.dia_visita || '—'}</td>
                  <td className="py-2.5 px-3 text-white/50">{c.metodo_contacto || '—'}</td>
                  <td className="py-2.5 px-3 text-white/60">{c.vendedor || '—'}</td>
                  <td className="py-2.5 px-3 text-white/50">{c.zona_ruta || '—'}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] px-1.5 py-0.5 font-bold uppercase ${
                      c.estado === 'activo'
                        ? 'text-green-400 bg-green-950/40 border border-green-800/30'
                        : 'text-white/30 bg-white/3 border border-white/10'
                    }`}>
                      {c.estado}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-white/30 text-xs whitespace-nowrap">{fmtDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
