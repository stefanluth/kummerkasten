'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/utils/prisma';

import config from '@/config.json';

export async function addReply(formData: FormData) {
  const password = cookies().get('password')?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return redirect('/unlock');

  const postId = formData.get('postId') as string;
  const content = formData.get('content') as string;

  const contentTooShort = content.length < config.minReplyLength;
  const contentTooLong = content.length > config.maxReplyLength;

  if (contentTooShort || contentTooLong) {
    return;
  }

  await prisma.post.create({
    data: {
      replyTo: postId,
      title: '',
      content,
    },
  });

  revalidatePath('/');
}
