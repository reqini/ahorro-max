import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getVendedorUsername } from '@/lib/admin-auth'
import { getParadas, getRecorrido } from '@/lib/recorridos'
import { formatearDistancia, formatearDuracion } from '@/lib/ruta'
import { cambiarEstadoRecorrido, borrarRecorrido } from '../actions'
import { RecorridoView } from './RecorridoView'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RecorridoDetallePage({ params }: PageProps) {
  const vendedor = await getVendedorUsername()
  if (!vendedor) redirect('/login')

  const { id } = await params
  const recorrido = await getRecorrido(id, vendedor)
  if (!recorrido) notFound()

  const paradas = await getParadas(id)
  const completado = recorrido.estado === 'completado'

  async function alternarEstado() {
    'use server'
    await cambiarEstadoRecorrido(id, completado ? 'activo' : 'completado')
  }

  async function eliminar() {
    'use server'
    await borrarRecorrido(id)
    redirect('/vendedor/recorridos')
  }

  const pie = (
    <div className="space-y-3">
      <div>
        <p className="text-white/70 text-sm font-semibold">{recorrido.nombre || 'Recorrido'}</p>
        <p className="text-white/30 text-[11px] mt-0.5">
          {paradas.length} paradas · {formatearDistancia(recorrido.distancia_m)} a pie ·{' '}
          {formatearDuracion(recorrido.minutos)} estimados
        </p>
      </div>

      <div className="flex items-center gap-2">
        <form action={alternarEstado} className="flex-1">
          <button
            className={`w-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border ${
              completado
                ? 'border-white/20 text-white/50'
                : 'border-green-700/60 text-green-400 bg-green-950/20'
            }`}
          >
            {completado ? 'Reabrir recorrido' : '✓ Marcar completado'}
          </button>
        </form>
        <form action={eliminar}>
          <button className="px-4 py-2.5 text-xs border border-red-900/50 text-red-500/70 transition-colors">
            Borrar
          </button>
        </form>
      </div>
    </div>
  )

  // Pantalla tipo app de viajes: el mapa ocupa todo y la lista sube desde abajo.
  // `absolute inset-0` se apoya en el <main> del layout, que es relative.
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Link
        href="/vendedor/recorridos"
        className="absolute left-3 top-3 z-[1000] px-3 py-2 bg-[#0d0d0d]/90 border border-white/20 text-white/70 text-xs"
      >
        ← Recorridos
      </Link>

      <RecorridoView recorridoId={id} paradas={paradas} pie={pie} />
    </div>
  )
}
