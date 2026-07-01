import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function verifyToken(token: string): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET ?? 'dev-secret'
  const idx = token.lastIndexOf('.')
  if (idx === -1) return false
  const value = token.slice(0, idx)
  const sig = token.slice(idx + 1)

  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(value)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify', 'sign']
  )

  // Compute expected sig
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
  const expectedSig = Buffer.from(signatureBuffer).toString('hex')

  if (sig.length !== expectedSig.length) return false

  // Constant-time comparison
  let diff = 0
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expectedSig.charCodeAt(i)
  }
  return diff === 0
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public login pages
  if (pathname === '/admin/login' || pathname === '/admin/login/') return NextResponse.next()
  if (pathname === '/vendedor/login' || pathname === '/vendedor/login/') return NextResponse.next()

  const token = request.cookies.get('admin_session')?.value
  if (!token || !(await verifyToken(token))) {
    // Redirect vendor routes to vendor login
    if (pathname.startsWith('/vendedor')) {
      return NextResponse.redirect(new URL('/vendedor/login', request.url))
    }
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*', '/vendedor/:path*'] }
