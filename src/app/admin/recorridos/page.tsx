import { contarPadron, getZonasPadron } from '@/lib/direcciones'
import { getVendedores } from '@/lib/vendedores'
import { aFechaISO, getAgendaSemana, getAvances, semanaLaboral, sumarSemanas } from '@/lib/recorridos'
import { ImportDirecciones } from './ImportDirecciones'
import { GeocodePanel } from './GeocodePanel'
import { ZonasPadron } from './ZonasPadron'
import { AsignarRecorrido } from './AsignarRecorrido'
import { AgendaSemana } from './AgendaSemana'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ semana?: string }>
}

export default async function RecorridosAdminPage({ searchParams }: PageProps) {
  const params = await searchParams
  const hoy = aFechaISO(new Date())

  // ?semana=YYYY-MM-DD permite moverse de semana sin estado en el cliente.
  const referencia = /^\d{4}-\d{2}-\d{2}$/.test(params.semana ?? '') ? params.semana! : hoy
  const [a, m, d] = referencia.split('-').map(Number)
  const semana = semanaLaboral(new Date(a, m - 1, d))

  const [stats, zonas, vendedores, agenda] = await Promise.all([
    contarPadron(),
    getZonasPadron(),
    getVendedores(),
    getAgendaSemana(semana[0], semana[4]),
  ])
  const avances = await getAvances(agenda.map((r) => r.id))

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-2">Recorridos</h1>
      <p className="text-white/40 text-sm mb-6">
        Cargá el padrón de direcciones y procesalo. Después cada vendedor elige sus zonas en{' '}
        <span className="text-white/60">Vendedor → Recorridos</span> y la app le arma el recorrido a pie.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Direcciones" valor={stats.total} />
        <Stat label="Zonas" valor={zonas.length} />
        <Stat label="Ubicadas" valor={stats.ok} color="text-green-400" />
        <Stat label="Pendientes" valor={stats.pendientes} color="text-[#F5C000]" />
      </div>

      <div className="space-y-6">
        {/* Agenda primero: es lo que el admin mira todos los días. */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-white font-semibold text-sm">Semana del {semana[0].split('-').reverse().join('/')}</h2>
          <div className="flex gap-1.5">
            <Link
              href={`/admin/recorridos?semana=${sumarSemanas(semana[0], -1)}`}
              className="px-3 py-1.5 border border-white/20 text-white/50 hover:text-white text-xs transition-colors"
            >
              ← Anterior
            </Link>
            <Link
              href="/admin/recorridos"
              className="px-3 py-1.5 border border-white/20 text-white/50 hover:text-white text-xs transition-colors"
            >
              Hoy
            </Link>
            <Link
              href={`/admin/recorridos?semana=${sumarSemanas(semana[0], 1)}`}
              className="px-3 py-1.5 border border-white/20 text-white/50 hover:text-white text-xs transition-colors"
            >
              Siguiente →
            </Link>
          </div>
        </div>

        <AgendaSemana semana={semana} hoy={hoy} recorridos={agenda} avances={avances} />

        <AsignarRecorrido
          zonas={zonas}
          vendedores={vendedores.filter((v) => v.activo).map((v) => ({ username: v.username, nombre: v.nombre }))}
          semana={semana}
          hoy={hoy}
        />

        <ImportDirecciones />

        {stats.pendientes > 0 && <GeocodePanel pendientes={stats.pendientes} />}

        <ZonasPadron zonas={zonas} />

        {stats.fallidas > 0 && (
          <p className="text-white/30 text-xs">
            {stats.fallidas} direcciones no se pudieron ubicar en el mapa (calle mal escrita o inexistente en
            OpenStreetMap). Igual entran en los recorridos, ordenadas por calle y altura al final de la lista.
          </p>
        )}
      </div>
    </div>
  )
}

function Stat({ label, valor, color = 'text-white' }: { label: string; valor: number; color?: string }) {
  return (
    <div className="border border-white/15 bg-[#131313] px-4 py-3">
      <p className={`text-xl font-bold ${color}`}>{valor.toLocaleString('es-AR')}</p>
      <p className="text-white/35 text-[11px] uppercase tracking-wide mt-0.5">{label}</p>
    </div>
  )
}
