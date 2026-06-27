import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

const COOKIE = 'admin_session'

function sign(value: string): string {
  const secret = process.env.ADMIN_SECRET ?? 'dev-secret'
  const sig = createHmac('sha256', secret).update(value).digest('hex')
  return `${value}.${sig}`
}

function verify(token: string): boolean {
  const idx = token.lastIndexOf('.')
  if (idx === -1) return false
  const value = token.slice(0, idx)
  const expected = sign(value)
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function setAdminSession() {
  const cookieStore = await cookies()
  const token = sign('authenticated')
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE)?.value
  if (!token) return false
  return verify(token)
}
