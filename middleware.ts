import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type Role = 'admin' | 'vendor'

async function verifyAndGetRole(token: string): Promise<Role | null> {
  const secret = process.env.ADMIN_SECRET ?? 'dev-secret'
  const idx = token.lastIndexOf('.')
  if (idx === -1) return null

  const value = token.slice(0, idx)
  const sig = token.slice(idx + 1)

  const encoder = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(value))
  const expectedSig = Buffer.from(signatureBuffer).toString('hex')

  if (sig.length !== expectedSig.length) return null
  let diff = 0
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expectedSig.charCodeAt(i)
  if (diff !== 0) return null

  if (value === 'admin' || value === 'vendor') return value
  return null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public login pages — always allow
  if (pathname === '/admin/login' || pathname === '/admin/login/') return NextResponse.next()
  if (pathname === '/vendedor/login' || pathname === '/vendedor/login/') return NextResponse.next()

  const token = request.cookies.get('admin_session')?.value
  const role = token ? await verifyAndGetRole(token) : null

  // Admin section requires admin role
  if (pathname.startsWith('/admin')) {
    if (role !== 'admin') return NextResponse.redirect(new URL('/admin/login', request.url))
    return NextResponse.next()
  }

  // Vendor section requires vendor role
  if (pathname.startsWith('/vendedor')) {
    if (role !== 'vendor') return NextResponse.redirect(new URL('/vendedor/login', request.url))
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*', '/vendedor/:path*'] }
