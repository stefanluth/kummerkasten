import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const fingerprint = request.cookies.get('fingerprint')?.value;
  const password = request.cookies.get('password')?.value;

  const noFingerprint = fingerprint == null || fingerprint === '';
  const wrongPassword = password !== process.env.UNLOCK_PASSWORD;

  if (noFingerprint || wrongPassword) {
    return NextResponse.redirect(new URL('/unlock', request.url));
  }
}

export const config = {
  matcher: ['/((?!unlock|faq|code-of-conduct|api|_next/static|_next/image|favicon.ico).*)'],
};
