'use server';

import { sanitize as purify } from 'isomorphic-dompurify';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getEnv } from '@/utils/env';
import { prisma } from '@/utils/prisma';

export async function addPost(formData: FormData) {
  const env = getEnv();
  const password = (await cookies()).get('password')?.value;
  if (password !== env.unlockPassword) return redirect('/unlock');

  const rawTitle = formData.get('title');
  const rawContent = formData.get('content');
  const replyTo = formData.get('replyTo');

  if (!rawTitle || !rawContent || typeof rawTitle !== 'string' || typeof rawContent !== 'string') {
    return 'Invalid title or content.';
  }

  const title = rawTitle.trim();
  const content = purify(rawContent.trim());

  const titleTooShort = title.length < env.minTitleLength;
  const titleTooLong = title.length > env.maxTitleLength;
  const contentTooShort = content.length < env.minContentLength;
  const contentTooLong = content.length > env.maxContentLength;

  switch (true) {
    case titleTooShort:
      return 'Title too short. Check for trailing spaces.';
    case titleTooLong:
      return 'Title too long. Check for trailing spaces.';
    case contentTooShort:
      return 'Content too short. Check for trailing spaces or HTML tags.';
    case contentTooLong:
      return 'Content too long. Check for trailing spaces.';
  }

  const post = await prisma.post.findFirst({
    where: {
      title,
      content,
    },
  });

  if (post) return 'Post already exists.';

  await prisma.post.create({
    data: {
      title,
      content,
      replyTo: typeof replyTo === 'string' ? replyTo : undefined,
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

export async function addPostAction(prevState: unknown, formData: FormData) {
  return await addPost(formData);
}
