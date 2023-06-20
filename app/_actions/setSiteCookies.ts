'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function setSiteCookies(formData: FormData) {
  const password = formData.get('password') as string;
  const fingerprint = formData.get('fingerprint') as string;

  console.log({ password, fingerprint });

  cookies().set('password', password, {
    path: '/',
    maxAge: 86400,
    secure: true,
    sameSite: 'strict',
  });

  cookies().set('fingerprint', fingerprint, {
    path: '/',
    maxAge: 86400,
    secure: true,
    sameSite: 'strict',
  });

  redirect('/');
}
