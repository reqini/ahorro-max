import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

const COOKIE = 'admin_session'

function sign(value: string): string {
  const secret = process.env.ADMIN_SECRET ?? 'dev-secret'
  const sig = createHmac('sha256', secret).update(value).digest('hex')
  return `${value}.${sig}`
}

function verifyAndExtract(token: string): string | null {
  const idx = token.lastIndexOf('.')
  if (idx === -1) return null
  const value = token.slice(0, idx)
  const expected = sign(value)
  try {
    if (timingSafeEqual(Buffer.from(token), Buffer.from(expected))) return value
    return null
  } catch {
    return null
  }
}

export type SessionRole = 'admin' | 'vendor'

async function setSession(value: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE, sign(value), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function setAdminSession() {
  return setSession('admin')
}

export async function setVendorSession(username: string) {
  return setSession(`vendor:${username}`)
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE)
}

async function getRawValue(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE)?.value
  if (!token) return null
  return verifyAndExtract(token)
}

export async function getSessionRole(): Promise<SessionRole | null> {
  const value = await getRawValue()
  if (value === 'admin') return 'admin'
  if (value?.startsWith('vendor:')) return 'vendor'
  return null
}

export async function getVendedorUsername(): Promise<string | null> {
  const value = await getRawValue()
  if (!value?.startsWith('vendor:')) return null
  return value.slice(7) || null
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSessionRole()) !== null
}

export async function isAdmin(): Promise<boolean> {
  return (await getSessionRole()) === 'admin'
}
