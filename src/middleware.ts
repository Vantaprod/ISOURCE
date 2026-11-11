import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Ignore static files, API routes, and Vercel preview URLs
  if (
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/api') || 
    url.pathname.includes('.') ||
    host.includes('vercel.app')
  ) {
    return NextResponse.next();
  }

  // 1. Seller Centre Subdomain (sellers.isourcemarket.com)
  if (host.startsWith('sellers.')) {
    if (!url.pathname.startsWith('/vendor')) {
      url.pathname = `/vendor${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.redirect(url);
    }
  }

  // 2. Admin Control Centre Subdomain (admin.isourcemarket.com)
  if (host.startsWith('admin.')) {
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.redirect(url);
    }
  }

  // 3. Logistics Centre Subdomain (logistics.isourcemarket.com)
  if (host.startsWith('logistics.')) {
    if (!url.pathname.startsWith('/admin/logistics')) {
      url.pathname = `/admin/logistics${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};