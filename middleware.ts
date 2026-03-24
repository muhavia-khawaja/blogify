import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const { pathname } = req.nextUrl

  const isLoginPage = pathname === '/control/login'
  const isControlRoute = pathname.startsWith('/control')

  if (!token) {
    if (isControlRoute && !isLoginPage) {
      return NextResponse.redirect(
        new URL('/control/login?error=unauthenticated', req.url),
      )
    }
    return NextResponse.next()
  }

  try {
    const secretKey = process.env.JWT_SECRET
    if (!secretKey) throw new Error('JWT_SECRET is not defined')

    const secret = new TextEncoder().encode(secretKey)

    await jwtVerify(token, secret)

    if (isLoginPage) {
      return NextResponse.redirect(new URL('/control', req.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Security Check Failed:', error)
    const res = NextResponse.redirect(
      new URL('/control/login?error=session_expired', req.url),
    )
    res.cookies.delete('token')
    return res
  }
}

export const config = {
  matcher: ['/control/:path*'],
}
