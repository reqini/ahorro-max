import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabase'
import { slugify } from '@/lib/slug'

/** Bucket público de Supabase Storage donde viven las fotos de producto. */
const BUCKET = 'productos'
const MAX_SIZE = 5 * 1024 * 1024
const EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

function verifyToken(token: string): boolean {
  const secret = process.env.ADMIN_SECRET ?? 'dev-secret'
  const idx = token.lastIndexOf('.')
  if (idx === -1) return false
  const value = token.slice(0, idx)
  const sig = createHmac('sha256', secret).update(value).digest('hex')
  const expected = `${value}.${sig}`
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected))
  } catch {
    return false
  }
}

interface Asignada {
  archivo: string
  producto: string
  url: string
}

/**
 * Busca a qué producto le corresponde una foto por el nombre del archivo. Primero
 * exacto ("cerveza-quilmes-473ml-x24.jpg"), y si no, por coincidencia parcial
 * siempre que dé con un solo producto: emparejar de más sería peor que no
 * emparejar, porque deja la foto equivocada en la góndola.
 */
function buscarProducto(
  archivo: string,
  productos: { id: string; nombre: string }[]
): { id: string; nombre: string } | null {
  const slug = slugify(archivo.replace(/\.[^.]+$/, ''))
  if (!slug) return null

  const exacto = productos.find((p) => slugify(p.nombre) === slug)
  if (exacto) return exacto

  const parciales = productos.filter((p) => {
    const s = slugify(p.nombre)
    return s.includes(slug) || slug.includes(s)
  })
  return parciales.length === 1 ? parciales[0] : null
}

/**
 * Sube fotos reales de producto. Con `producto_id` la foto va a ese producto; sin
 * él se suben varias de una y cada archivo se asigna por su nombre, que es la
 * única forma razonable de cargar la lista entera sin editar producto por producto.
 */
export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const formData = await request.formData()
  const productoId = (formData.get('producto_id') as string | null)?.trim() ?? ''
  const archivos = formData.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)

  if (archivos.length === 0) {
    return NextResponse.json({ error: 'No se recibió ninguna foto' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const { data: productos, error: errorProductos } = await supabase
    .from('productos')
    .select('id, nombre')
  if (errorProductos) {
    return NextResponse.json({ error: errorProductos.message }, { status: 500 })
  }

  const lista = (productos ?? []) as { id: string; nombre: string }[]
  const asignadas: Asignada[] = []
  const sinProducto: string[] = []
  const rechazadas: string[] = []

  for (const archivo of archivos) {
    const extension = EXTENSION[archivo.type]
    if (!extension) {
      rechazadas.push(`${archivo.name} (formato no soportado)`)
      continue
    }
    if (archivo.size > MAX_SIZE) {
      rechazadas.push(`${archivo.name} (pesa más de 5MB)`)
      continue
    }

    const destino = productoId
      ? lista.find((p) => p.id === productoId) ?? null
      : buscarProducto(archivo.name, lista)

    if (!destino) {
      sinProducto.push(archivo.name)
      continue
    }

    const ruta = `${slugify(destino.nombre)}.${extension}`
    const buffer = Buffer.from(await archivo.arrayBuffer())
    const { error: errorUpload } = await supabase.storage
      .from(BUCKET)
      .upload(ruta, buffer, { contentType: archivo.type, upsert: true })

    if (errorUpload) {
      rechazadas.push(`${archivo.name} (${errorUpload.message})`)
      continue
    }

    const { data: publica } = supabase.storage.from(BUCKET).getPublicUrl(ruta)
    // El parámetro de versión evita que quede cacheada la foto anterior cuando se
    // reemplaza la de un producto que ya tenía una.
    const url = `${publica.publicUrl}?v=${Date.now()}`

    const { error: errorUpdate } = await supabase
      .from('productos')
      .update({ imagen_url: url })
      .eq('id', destino.id)

    if (errorUpdate) {
      rechazadas.push(`${archivo.name} (${errorUpdate.message})`)
      continue
    }

    asignadas.push({ archivo: archivo.name, producto: destino.nombre, url })
  }

  if (asignadas.length > 0) {
    revalidatePath('/')
    revalidatePath('/catalogo')
    revalidatePath('/admin/productos')
    revalidatePath('/vendedor/productos')
  }

  return NextResponse.json({ asignadas, sinProducto, rechazadas })
}
