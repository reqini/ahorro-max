import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getVendedorUsername } from '@/lib/admin-auth'
import { getZonasPadron } from '@/lib/direcciones'
import {
  DIAS_LABORALES,
  aFechaISO,
  etiquetaDia,
  getAvances,
  getRecorridosEntre,
  semanaLaboral,
  sumarSemanas,
  type Recorrido,
} from '@/lib/recorridos'
import { formatearDistancia, formatearDuracion } from '@/lib/ruta'
import { NuevoRecorridoForm } from './NuevoRecorridoForm'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ semana?: string }>
}

export default async function RecorridosPage({ searchParams }: PageProps) {
  const vendedor = await getVendedorUsername()
  if (!vendedor) redirect('/login')

  const params = await searchParams
  const hoy = aFechaISO(new Date())
  const referencia = /^\d{4}-\d{2}-\d{2}$/.test(params.semana ?? '') ? params.semana! : hoy
  const [a, m, d] = referencia.split('-').map(Number)
  const semana = semanaLaboral(new Date(a, m - 1, d))

  const [zonas, recorridos] = await Promise.all([
    getZonasPadron(),
    getRecorridosEntre(vendedor, semana[0], semana[4]),
  ])
  const avances = await getAvances(recorridos.map((r) => r.id))

  const total = recorridos.length
  const completados = recorridos.filter((r) => r.estado === 'completado').length

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-white">Mi semana</h1>
          <p className="text-white/35 text-xs mt-0.5">
            {total === 0
              ? 'Sin recorridos asignados esta semana'
              : `${completados} de ${total} recorridos completados`}
          </p>
        </div>
        <div className="flex gap-1 shrink-0">
          <Link
            href={`/vendedor/recorridos?semana=${sumarSemanas(semana[0], -1)}`}
            className="px-2.5 py-1.5 border border-white/15 text-white/50 text-xs"
          >
            ←
          </Link>
          <Link href="/vendedor/recorridos" className="px-2.5 py-1.5 border border-white/15 text-white/50 text-xs">
            Hoy
          </Link>
          <Link
            href={`/vendedor/recorridos?semana=${sumarSemanas(semana[0], 1)}`}
            className="px-2.5 py-1.5 border border-white/15 text-white/50 text-xs"
          >
            →
          </Link>
        </div>
      </div>

      {/* Un bloque por día hábil: es la agenda que arma el admin. */}
      <div className="space-y-3">
        {semana.map((fecha, i) => {
          const delDia = recorridos.filter((r) => r.fecha === fecha)
          const esHoy = fecha === hoy

          return (
            <div key={fecha}>
              <div className="flex items-baseline gap-2 mb-1.5">
                <span
                  className={`text-xs font-bold uppercase tracking-wide ${
                    esHoy ? 'text-[#F5C000]' : 'text-white/40'
                  }`}
                >
                  {DIAS_LABORALES[i]}
                </span>
                <span className="text-white/25 text-[11px]">{etiquetaDia(fecha)}</span>
                {esHoy && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-[#F5C000]/15 border border-[#F5C000]/40 text-[#F5C000] font-bold uppercase">
                    Hoy
                  </span>
                )}
              </div>

              {delDia.length === 0 ? (
                <div className={`border border-dashed px-4 py-3 ${esHoy ? 'border-white/15' : 'border-white/8'}`}>
                  <p className="text-white/20 text-xs">Sin recorridos</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {delDia.map((r) => (
                    <TarjetaRecorrido key={r.id} recorrido={r} avance={avances.get(r.id)} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="pt-2">
        <NuevoRecorridoForm zonas={zonas} />
      </div>
    </div>
  )
}

function TarjetaRecorrido({
  recorrido: r,
  avance,
}: {
  recorrido: Recorrido
  avance?: { total: number; hechas: number }
}) {
  const { total, hechas } = avance ?? { total: 0, hechas: 0 }
  const pct = total > 0 ? Math.round((hechas / total) * 100) : 0

  return (
    <Link
      href={`/vendedor/recorridos/${r.id}`}
      className="block border border-white/15 bg-[#111] p-3.5 active:bg-white/5 transition-colors"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">{r.nombre || 'Recorrido'}</p>
          <p className="text-white/30 text-[11px] mt-0.5">
            {total} paradas · {formatearDistancia(r.distancia_m)} · {formatearDuracion(r.minutos)}
            {r.asignado_por && <span className="text-white/45"> · asignado</span>}
          </p>
        </div>
        <span
          className={`text-[10px] px-2 py-1 border uppercase tracking-wide shrink-0 ${
            r.estado === 'completado'
              ? 'border-green-700/50 text-green-400 bg-green-950/30'
              : 'border-[#F5C000]/40 text-[#F5C000] bg-[#F5C000]/5'
          }`}
        >
          {r.estado === 'completado' ? 'OK' : 'Activo'}
        </span>
      </div>

      <div className="h-1 bg-white/10 overflow-hidden">
        <div
          className={`h-full transition-all ${r.estado === 'completado' ? 'bg-green-500' : 'bg-[#CC0000]'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-white/30 text-[11px] mt-1.5">{hechas} de {total} paradas hechas</p>
    </Link>
  )
}
