import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { isAdmin } from '@/lib/admin-auth'
import { geocodificarTanda } from '@/lib/geocode'

// Nominatim admite 1 consulta por segundo: una tanda de 20 direcciones tarda ~22s.
// El panel de admin llama a esta ruta en loop hasta que no quedan pendientes.
export const maxDuration = 60
export const dynamic = 'force-dynamic'

const MAX_POR_TANDA = 25

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let body: { zonas?: unknown; limite?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const zonas = Array.isArray(body.zonas) ? body.zonas.filter((z): z is string => typeof z === 'string') : []
  const limite = Math.min(Number(body.limite) || 20, MAX_POR_TANDA)

  const resultado = await geocodificarTanda(zonas, limite)

  if (resultado.restantes === 0) {
    revalidatePath('/admin/recorridos')
    revalidatePath('/vendedor/recorridos')
  }

  return NextResponse.json(resultado)
}
