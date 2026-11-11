import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  if (
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/api') || 
    url.pathname.includes('.') ||
    host.includes('vercel.app')
  ) {
    return NextResponse.next();
  }

  // 1. Seller Centre
  if (host.startsWith('sellers.')) {
    if (url.pathname === '/') {
      url.pathname = '/vendor';
      return NextResponse.rewrite(url);
    }
    // Allow login/register pages to work normally
    if (url.pathname.startsWith('/login') || url.pathname.startsWith('/register')) {
      return NextResponse.next();
    }
    // Rewrite other paths to /vendor
    if (!url.pathname.startsWith('/vendor')) {
      url.pathname = `/vendor${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // 2. Admin Control Centre
  if (host.startsWith('admin.')) {
    if (url.pathname === '/') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }
    if (url.pathname.startsWith('/login')) {
      return NextResponse.next();
    }
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // 3. Logistics Centre
  if (host.startsWith('logistics.')) {
    if (url.pathname === '/') {
      url.pathname = '/admin/logistics';
      return NextResponse.rewrite(url);
    }
    if (url.pathname.startsWith('/login')) {
      return NextResponse.next();
    }
    if (!url.pathname.startsWith('/admin/logistics')) {
      url.pathname = `/admin/logistics${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};