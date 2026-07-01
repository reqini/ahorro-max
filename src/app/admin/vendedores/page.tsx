import { getVendedores } from '@/lib/vendedores'
import { addVendedor, toggleVendedor, resetPassword, deleteVendedor } from './actions'
import { DeleteButton } from '@/app/admin/components/DeleteButton'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export default async function VendedoresPage() {
  const vendedores = await getVendedores()

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Vendedores</h1>
        <p className="text-white/40 text-sm mt-0.5">Cuentas de acceso para la app de vendedores</p>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3 mb-8">
        {vendedores.length === 0 && (
          <p className="text-white/30 text-sm py-4">No hay vendedores todavía.</p>
        )}
        {vendedores.map((v) => {
          const boundToggle = toggleVendedor.bind(null, v.id, !v.activo)
          const boundDelete = deleteVendedor.bind(null, v.id)
          const boundReset = resetPassword.bind(null, v.id)

          return (
            <div key={v.id} className={`border p-4 flex flex-col gap-3 ${v.activo ? 'border-white/10 bg-[#111]' : 'border-white/5 bg-[#0d0d0d] opacity-60'}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold">{v.nombre}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 font-bold uppercase ${v.activo ? 'text-green-400 border border-green-800/40 bg-green-950/30' : 'text-white/30 border border-white/10'}`}>
                      {v.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <p className="text-white/40 text-xs mt-0.5">@{v.username} · Alta {fmtDate(v.created_at)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <form action={boundToggle}>
                    <button type="submit" className="text-xs px-3 py-1.5 border border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors">
                      {v.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </form>
                  <DeleteButton action={boundDelete} label={`¿Eliminar a ${v.nombre}?`} />
                </div>
              </div>

              {/* Reset password */}
              <details className="group">
                <summary className="text-white/30 text-xs cursor-pointer hover:text-white/60 transition-colors list-none">
                  ▸ Cambiar contraseña
                </summary>
                <form action={boundReset} className="flex gap-2 mt-2">
                  <input name="password" type="password" placeholder="Nueva contraseña" minLength={4} required
                    className="flex-1 bg-[#1a1a1a] border border-white/20 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/30" />
                  <button type="submit"
                    className="px-4 py-2 bg-white/5 border border-white/20 text-white/70 text-sm hover:text-white transition-colors">
                    Guardar
                  </button>
                </form>
              </details>
            </div>
          )
        })}
      </div>

      {/* Add form */}
      <div className="border border-white/10 bg-[#111] p-5">
        <h2 className="text-white font-semibold text-sm mb-4">Agregar vendedor</h2>
        <form action={addVendedor} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Nombre completo</label>
              <input name="nombre" required placeholder="Pedro García"
                className="w-full bg-[#1a1a1a] border border-white/20 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/30" />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Usuario</label>
              <input name="username" required placeholder="pedro" autoCapitalize="off"
                className="w-full bg-[#1a1a1a] border border-white/20 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/30" />
            </div>
          </div>
          <div>
            <label className="text-white/50 text-xs uppercase tracking-wide block mb-1">Contraseña inicial</label>
            <input name="password" type="password" required minLength={4} placeholder="Mínimo 4 caracteres"
              className="w-full bg-[#1a1a1a] border border-white/20 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#CC0000] transition-colors placeholder-white/30" />
          </div>
          <button type="submit"
            className="self-start bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 transition-colors">
            Crear vendedor
          </button>
        </form>
      </div>
    </div>
  )
}
