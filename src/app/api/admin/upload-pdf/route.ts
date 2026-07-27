import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabase'

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

export async function POST(request: NextRequest) {
  // Verify admin session
  const token = request.cookies.get('admin_session')?.value
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const formData = await request.formData()
  const tipo = formData.get('tipo') as string
  const file = formData.get('file') as File | null

  if (!tipo || !['minorista', 'mayorista'].includes(tipo)) {
    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
  }

  if (!file) {
    return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'El archivo debe ser un PDF' }, { status: 400 })
  }

  const MAX_SIZE = 15 * 1024 * 1024 // 15MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'El archivo es demasiado grande (máx 15MB)' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const supabase = getSupabaseAdmin()

  const { error: uploadError } = await supabase.storage
    .from('listas-precios')
    .upload(`${tipo}.pdf`, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const downloadName = tipo === 'minorista' ? 'Lista-Minorista-AhorraMax.pdf' : 'Lista-Mayorista-AhorraMax.pdf'
  const { data: publicUrlData } = supabase.storage
    .from('listas-precios')
    .getPublicUrl(`${tipo}.pdf`, { download: downloadName })

  const publicUrl = publicUrlData.publicUrl

  const configKey = tipo === 'minorista' ? 'lista_minorista_url' : 'lista_mayorista_url'
  await supabase
    .from('config')
    .upsert({ key: configKey, value: publicUrl, updated_at: new Date().toISOString() }, { onConflict: 'key' })

  revalidatePath('/')

  return NextResponse.json({ url: publicUrl })
}
