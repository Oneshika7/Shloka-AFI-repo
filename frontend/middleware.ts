import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "development_secret_key_123" });
  
  // API Route Handling: Attach the backend JWT to proxy requests
  if (req.nextUrl.pathname.startsWith('/api/v1/')) {
    const requestHeaders = new Headers(req.headers);
    if (token && token.accessToken) {
      requestHeaders.set('Authorization', `Bearer ${token.accessToken}`);
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // UI Route Handling: Redirect to login if unauthenticated
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/workspace/:path*",
    "/insights/:path*",
    "/collections/:path*",
    "/graph/:path*",
    "/vr-room/:path*",
    "/settings/:path*",
    "/dashboard/:path*",
    "/api/v1/:path*"
  ],
};
