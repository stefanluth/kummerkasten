'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function setPasswordCookie(formData: FormData) {
  const password = formData.get('password') as string;
  cookies().set('password', password, {
    path: '/',
    maxAge: 86400,
    secure: true,
    sameSite: 'strict',
  });
  redirect('/');
}
