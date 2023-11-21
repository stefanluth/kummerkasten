'use server';

import { sanitize as purify } from 'isomorphic-dompurify';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { DEFAULTS } from '@/utils';
import { prisma } from '@/utils/prisma';

export async function addPost(formData: FormData) {
  const password = cookies().get('password')?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return redirect('/unlock');

  const rawTitle = formData.get('title') as string;
  const title = rawTitle.trim();

  const rawContent = formData.get('content') as string;
  const content = purify(rawContent.trim());

  const titleTooShort = title.length < Number(process.env.MIN_TITLE_LENGTH ?? DEFAULTS.MIN_TITLE_LENGTH);
  const titleTooLong = title.length > Number(process.env.MAX_TITLE_LENGTH ?? DEFAULTS.MAX_TITLE_LENGTH);
  const contentTooShort = content.length < Number(process.env.MIN_CONTENT_LENGTH ?? DEFAULTS.MIN_CONTENT_LENGTH);
  const contentTooLong = content.length > Number(process.env.MAX_CONTENT_LENGTH ?? DEFAULTS.MAX_CONTENT_LENGTH);

  switch (true) {
    case titleTooShort:
      return 'Titel zu kurz. Überprüfe auf angehängte Leerzeichen.';
    case titleTooLong:
      return 'Titel zu lang. Überprüfe auf angehängte Leerzeichen.';
    case contentTooShort:
      return 'Inhalt zu kurz. Überprüfe auf angehängte Leerzeichen oder HTML-Tags.';
    case contentTooLong:
      return 'Inhalt zu lang. Überprüfe auf angehängte Leerzeichen.';
  }

  await prisma.post.create({
    data: {
      title,
      content,
    },
  });

  revalidatePath('/');
  revalidatePath('/top/day');
  revalidatePath('/top/week');
  revalidatePath('/top/month');
  revalidatePath('/top/year');
  revalidatePath('/top/all');

  return null;
}

export async function addPostAction(prevState: any, formData: FormData) {
  return await addPost(formData);
}
