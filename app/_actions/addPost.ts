'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/utils/prisma';

import config from '@/config.json';

export async function addPost(formData: FormData) {
  const password = cookies().get('password')?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return redirect('/unlock');

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  const titleTooShort = title.length < config.minTitleLength;
  const titleTooLong = title.length > config.maxTitleLength;
  const contentTooShort = content.length < config.minContentLength;
  const contentTooLong = content.length > config.maxContentLength;

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
