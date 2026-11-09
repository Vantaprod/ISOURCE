import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Ignore static files and API routes
  if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/api') || url.pathname.includes('.')) {
    return NextResponse.next();
  }

  // 1. Seller Centre Subdomain (sellers.isourcemarket.com)
  if (host.startsWith('sellers.')) {
    if (url.pathname === '/') {
      url.pathname = '/vendor';
      return NextResponse.rewrite(url);
    }
    // If they somehow navigate to /vendor on the subdomain, clean the URL
    if (url.pathname.startsWith('/vendor')) {
      url.pathname = url.pathname.replace('/vendor', '') || '/';
      return NextResponse.redirect(url);
    }
  }

  // 2. Admin Control Centre Subdomain (admin.isourcemarket.com)
  if (host.startsWith('admin.')) {
    if (url.pathname === '/') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }
    if (url.pathname.startsWith('/admin')) {
      url.pathname = url.pathname.replace('/admin', '') || '/';
      return NextResponse.redirect(url);
    }
  }

  // 3. Logistics Centre Subdomain (logistics.isourcemarket.com)
  if (host.startsWith('logistics.')) {
    if (url.pathname === '/') {
      url.pathname = '/admin/logistics';
      return NextResponse.rewrite(url);
    }
    if (url.pathname.startsWith('/admin/logistics')) {
      url.pathname = url.pathname.replace('/admin/logistics', '') || '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};