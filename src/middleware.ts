import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes require authentication
const protectedRoutes = ['/app']
// Auth routes should redirect to /app if already authenticated
const authRoutes = ['/auth/login', '/auth/register', '/auth/verify-otp', '/auth/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // In a real implementation, we'd check cookies. For localstorage, middleware can't directly read it easily without sending a cookie. 
  // Let's assume a cookie 'surexend_access_token' is set along with localstorage for SSR auth, or we just rely on client-side redirect.
  // We'll implement a basic cookie check. If using only localStorage, middleware redirect won't work perfectly for initial load without cookies.
  // Assuming the app sets a cookie:
  const token = request.cookies.get('surexend_access_token')?.value

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/app/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/auth/:path*'],
}
