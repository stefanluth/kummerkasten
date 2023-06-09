'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import DEFAULTS from '@/utils/defaults';
import { prisma } from '@/utils/prisma';

export async function addPost(formData: FormData) {
  const password = cookies().get('password')?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return redirect('/unlock');

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  const titleTooShort = title.length < Number(process.env.MIN_TITLE_LENGTH ?? DEFAULTS.MIN_TITLE_LENGTH);
  const titleTooLong = title.length > Number(process.env.MAX_TITLE_LENGTH ?? DEFAULTS.MAX_TITLE_LENGTH);
  const contentTooShort = content.length < Number(process.env.MIN_CONTENT_LENGTH ?? DEFAULTS.MIN_CONTENT_LENGTH);
  const contentTooLong = content.length > Number(process.env.MAX_CONTENT_LENGTH ?? DEFAULTS.MAX_CONTENT_LENGTH);

  if (titleTooShort || titleTooLong || contentTooShort || contentTooLong) {
    return;
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
    },
  });

  revalidatePath('/');
  redirect('/');
}
