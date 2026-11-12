'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
  maxAge: 86400,
  secure: true,
  sameSite: 'none',
  httpOnly: true,
};

export async function setSiteCookies(formData: FormData) {
  const password = formData.get('password') as string;

  if (!password) return { error: 'No password entered' };
  if (password !== getEnv().unlockPassword) return { error: 'Incorrect password' };

  const fingerprint = formData.get('fingerprint') as string;

  const cookieStore = await cookies();
  cookieStore.set('password', password, cookieOptions);
  cookieStore.set('fingerprint', fingerprint, cookieOptions);

  redirect('/');
}
