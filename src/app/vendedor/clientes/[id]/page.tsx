import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCliente, getNotasCliente } from '@/lib/clientes'
import { updateCliente, addNota, deleteNota } from './actions'
import { deleteCliente } from '../actions'
import { EditClienteForm } from './EditClienteForm'
import { AddNotaForm } from './AddNotaForm'

const TIPO_BADGE: Record<string, string> = {
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

interface Props {
  params: Promise<{ id: string }>
}

export default async function ClienteDetailPage({ params }: Props) {
  const { id } = await params
  const [cliente, notas] = await Promise.all([getCliente(id), getNotasCliente(id)])

  if (!cliente) redirect('/vendedor/clientes')

  const boundUpdate = updateCliente.bind(null, cliente.id)
  const boundAddNota = addNota.bind(null, cliente.id)
  const boundDelete = deleteCliente.bind(null, cliente.id)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-[53px] z-20 bg-[#0d0d0d] border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/vendedor/clientes" className="text-white/40 hover:text-white transition-colors text-sm flex items-center gap-1">
          ← Clientes
        </Link>
        <form action={boundDelete}>
          <button type="submit"
            onClick={(e) => { if (!confirm('¿Eliminar este cliente y todas sus notas?')) e.preventDefault() }}
            className="text-xs px-3 py-1.5 border border-red-900/60 text-red-500/70 hover:text-red-400 hover:border-red-600 transition-colors">
            Eliminar
          </button>
        </form>
      </div>

      {/* Cliente header */}
      <div className="px-4 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shrink-0 ${
            cliente.tipo === 'minorista' ? 'bg-[#CC0000]/20 text-[#CC0000]' :
            cliente.tipo === 'mayorista' ? 'bg-[#F5C000]/20 text-[#F5C000]' :
            'bg-white/5 text-white/40'
          }`}>
            {cliente.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold text-lg leading-tight">{cliente.nombre}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-[10px] px-2 py-0.5 font-bold uppercase ${TIPO_BADGE[cliente.tipo]}`}>
                {cliente.tipo}
              </span>
              <span className={`text-[10px] px-2 py-0.5 font-bold uppercase ${
                cliente.estado === 'activo'
                  ? 'bg-green-950/40 text-green-400 border border-green-800/40'
                  : 'bg-white/5 text-white/30 border border-white/10'
              }`}>
                {cliente.estado}
              </span>
              {cliente.tipo_negocio && (
                <span className="text-white/40 text-xs">{cliente.tipo_negocio}</span>
              )}
            </div>
            {(cliente.vendedor || cliente.zona_ruta) && (
              <p className="text-white/30 text-xs mt-1">
                {[cliente.vendedor && `Vend: ${cliente.vendedor}`, cliente.zona_ruta && `Zona: ${cliente.zona_ruta}`]
                  .filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Info + edit inline */}
      <EditClienteForm cliente={cliente} updateAction={boundUpdate} />

      {/* Notas */}
      <div className="flex-1 px-4 pt-5 pb-36">
        <h2 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">
          Notas {notas.length > 0 && `(${notas.length})`}
        </h2>

        {notas.length === 0 && (
          <p className="text-white/20 text-sm italic">Sin notas todavía.</p>
        )}

        <div className="flex flex-col gap-3">
          {notas.map((nota) => {
            const boundDeleteNota = deleteNota.bind(null, nota.id, cliente.id)
            return (
              <div key={nota.id} className="bg-[#1a1a1a] border border-white/5 p-3 flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-white/80 text-sm whitespace-pre-wrap">{nota.texto}</p>
                  <p className="text-white/25 text-[11px] mt-1.5">{fmtDate(nota.created_at)}</p>
                </div>
                <form action={boundDeleteNota}>
                  <button type="submit"
                    onClick={(e) => { if (!confirm('¿Eliminar esta nota?')) e.preventDefault() }}
                    className="text-white/20 hover:text-red-400 transition-colors text-sm mt-0.5">
                    ✕
                  </button>
                </form>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sticky add nota */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-white/10 px-4 py-3 max-w-2xl mx-auto">
        <AddNotaForm action={boundAddNota} />
      </div>
    </div>
  )
}
