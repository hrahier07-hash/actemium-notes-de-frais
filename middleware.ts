import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const isLoginPage = req.nextUrl.pathname === '/login'
  const isPendingPage = req.nextUrl.pathname === '/pending'

  // Pas connecté → login
  if (!session && !isLoginPage && !isPendingPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Connecté → vérifier l'approbation
  if (session && !isLoginPage && !isPendingPage) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('approved')
      .eq('user_id', session.user.id)
      .single()

    // Pas approuvé → page d'attente
    if (!profile?.approved) {
      return NextResponse.redirect(new URL('/pending', req.url))
    }
  }

  // Déjà connecté et approuvé → pas besoin d'aller sur /login ou /pending
  if (session && (isLoginPage || isPendingPage)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('approved')
      .eq('user_id', session.user.id)
      .single()

    if (profile?.approved) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    // Si pas approuvé et sur /login → laisser passer vers /pending
    if (!profile?.approved && isLoginPage) {
      return NextResponse.redirect(new URL('/pending', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
