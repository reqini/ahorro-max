import Link from 'next/link'
import { DIAS_LABORALES, etiquetaDia, type Recorrido } from '@/lib/recorridos'
import { formatearDistancia } from '@/lib/ruta'
import { DeleteButton } from '../components/DeleteButton'
import { borrarRecorridoAdmin } from './asignarActions'

interface Props {
  semana: string[]
  hoy: string
  recorridos: Recorrido[]
  avances: Map<string, { total: number; hechas: number }>
}

/** Grilla lunes a viernes con lo que tiene asignado cada vendedor. */
export function AgendaSemana({ semana, hoy, recorridos, avances }: Props) {
  return (
    <div className="border border-white/20 bg-[#131313] shadow-xl shadow-black/60">
      <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between gap-3">
        <span className="text-white/60 text-xs uppercase tracking-wide font-bold">Agenda de la semana</span>
        <span className="text-white/30 text-xs">
          {recorridos.length} recorrido{recorridos.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-white/10">
        {semana.map((fecha, i) => {
          const delDia = recorridos.filter((r) => r.fecha === fecha)
          const esHoy = fecha === hoy

          return (
            <div key={fecha} className={`p-3 min-h-[120px] ${esHoy ? 'bg-[#CC0000]/5' : ''}`}>
              <div className="mb-2">
                <p className={`text-xs font-bold uppercase ${esHoy ? 'text-[#F5C000]' : 'text-white/50'}`}>
                  {DIAS_LABORALES[i]}
                  {esHoy && ' · hoy'}
                </p>
                <p className="text-white/25 text-[10px]">{etiquetaDia(fecha)}</p>
              </div>

              {delDia.length === 0 ? (
                <p className="text-white/20 text-[11px]">Sin recorridos</p>
              ) : (
                <div className="space-y-2">
                  {delDia.map((r) => {
                    const avance = avances.get(r.id) ?? { total: 0, hechas: 0 }
                    const pct = avance.total > 0 ? Math.round((avance.hechas / avance.total) * 100) : 0

                    return (
                      <div key={r.id} className="border border-white/10 bg-[#0d0d0d] p-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-white text-xs font-semibold truncate">{r.nombre || 'Recorrido'}</p>
                            <p className="text-white/35 text-[10px] mt-0.5">@{r.vendedor}</p>
                          </div>
                          <DeleteButton
                            action={borrarRecorridoAdmin.bind(null, r.id)}
                            label={`¿Borrar el recorrido "${r.nombre}" de @${r.vendedor}?`}
                          />
                        </div>

                        <div className="h-1 bg-white/10 mt-1.5 overflow-hidden">
                          <div
                            className={`h-full ${r.estado === 'completado' ? 'bg-green-500' : 'bg-[#CC0000]'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-white/30 text-[10px] mt-1">
                          {avance.hechas}/{avance.total} paradas · {formatearDistancia(r.distancia_m)}
                          {r.asignado_por === '' && <span className="text-white/20"> · propio</span>}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="px-5 py-2.5 border-t border-white/10">
        <Link href="/vendedor/recorridos" className="text-white/30 hover:text-white/60 text-[11px] transition-colors">
          Los vendedores ven esta agenda en su sección Recorridos
        </Link>
      </div>
    </div>
  )
}
