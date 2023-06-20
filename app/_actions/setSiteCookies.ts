'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
  sameSite: 'strict',
  httpOnly: true,
};

export async function setSiteCookies(formData: FormData) {
  const password = formData.get('password') as string;
  const fingerprint = formData.get('fingerprint') as string;

  cookies().set('password', password, cookieOptions);
  cookies().set('fingerprint', fingerprint, cookieOptions);

  redirect('/');
}
