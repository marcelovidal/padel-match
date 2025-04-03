import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si el usuario está autenticado y está en la página de login o registro
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
    // Obtener el rol del usuario
    const userRole = session.user.user_metadata.role

    // Redirigir según el rol
    if (userRole === 'player') {
      return NextResponse.redirect(new URL('/player', req.url))
    } else if (userRole === 'club_owner') {
      return NextResponse.redirect(new URL('/club', req.url))
    }
  }

  // Si el usuario no está autenticado y está intentando acceder a rutas protegidas
  if (!session && (req.nextUrl.pathname.startsWith('/player') || req.nextUrl.pathname.startsWith('/club'))) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/login', '/register', '/player/:path*', '/club/:path*']
} 