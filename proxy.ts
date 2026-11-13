import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { SESSION_COOKIE_NAME, verifyUnlockSessionToken } from '@/utils/auth-session';

export async function proxy(request: NextRequest) {
  const fingerprint = request.cookies.get('fingerprint')?.value;
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const noFingerprint = !fingerprint;
  const invalidSession = !(await verifyUnlockSessionToken(session, process.env.SESSION_SECRET));

  if (noFingerprint || invalidSession) {
    const response = NextResponse.redirect(new URL('/unlock', request.url));
    response.cookies.delete('password');
    return response;
  }
}

export const config = {
  matcher: ['/((?!unlock|faq|code-of-conduct|api|_next|public|static|favicon.ico).*)'],
};
