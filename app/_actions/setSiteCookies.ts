'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS, createUnlockSessionToken } from '@/utils/auth-session';
import { getEnv } from '@/utils/env';

type CookieOptions = {
  path: string;
  maxAge: number;
  secure: boolean;
  sameSite: boolean | 'lax' | 'strict' | 'none' | undefined;
  httpOnly: boolean;
};

const cookieOptions: CookieOptions = {
  path: '/',
  maxAge: SESSION_DURATION_SECONDS,
  secure: true,
  sameSite: 'none',
  httpOnly: true,
};

export async function setSiteCookies(formData: FormData) {
  const password = formData.get('password');

  if (typeof password !== 'string' || !password) return { error: 'No password entered' };

  const env = getEnv();
  if (password !== env.unlockPassword) return { error: 'Incorrect password' };

  const fingerprintValue = formData.get('fingerprint');
  const fingerprint = typeof fingerprintValue === 'string' ? fingerprintValue : '';
  const sessionToken = await createUnlockSessionToken(env.sessionSecret);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, cookieOptions);
  cookieStore.set('fingerprint', fingerprint, cookieOptions);
  cookieStore.delete('password');

  redirect('/');
}
