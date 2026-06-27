import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
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

  const { data: publicUrlData } = supabase.storage
    .from('listas-precios')
    .getPublicUrl(`${tipo}.pdf`)

  const publicUrl = publicUrlData.publicUrl

  const configKey = tipo === 'minorista' ? 'lista_minorista_url' : 'lista_mayorista_url'
  await supabase
    .from('config')
    .upsert({ key: configKey, value: publicUrl, updated_at: new Date().toISOString() }, { onConflict: 'key' })

  return NextResponse.json({ url: publicUrl })
}
