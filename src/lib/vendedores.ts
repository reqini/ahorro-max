import { scryptSync, randomBytes, timingSafeEqual } from 'crypto'
import { getSupabaseAdmin } from './supabase'

export interface Vendedor {
  id: string
  username: string
  nombre: string
  activo: boolean
  created_at: string
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(':')
    const buf = scryptSync(password, salt, 64)
    return timingSafeEqual(buf, Buffer.from(hash, 'hex'))
  } catch {
    return false
  }
}

export async function getVendedorByUsername(username: string): Promise<(Vendedor & { password_hash: string }) | null> {
  const { data } = await getSupabaseAdmin()
    .from('vendedores')
    .select('*')
    .eq('username', username.toLowerCase().trim())
    .eq('activo', true)
    .single()
  return (data ?? null) as (Vendedor & { password_hash: string }) | null
}

export async function getVendedores(): Promise<Vendedor[]> {
  const { data } = await getSupabaseAdmin()
    .from('vendedores')
    .select('id, username, nombre, activo, created_at')
    .order('created_at', { ascending: false })
  return (data ?? []) as Vendedor[]
}
