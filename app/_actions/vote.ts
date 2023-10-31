import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { prisma } from '@/utils/prisma';

export async function vote(formData: FormData) {
  'use server';

  const postId = formData.get('postId') as string;
  const upvote = formData.get('upvote') === 'true';
  const fingerprint = cookies().get('fingerprint')?.value;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post || !fingerprint) {
    return;
  }

  const vote = await prisma.vote.findFirst({
    where: {
      postId,
      fingerprint,
    },
  });

  if (vote) {
    if (vote.upvote === upvote) {
      await prisma.vote.delete({
        where: {
          id: vote.id,
        },
      });
    } else {
      await prisma.vote.update({
        where: {
          id: vote.id,
        },
        data: {
          upvote,
        },
      });
    }
  } else {
    await prisma.vote.create({
      data: {
        postId,
        fingerprint,
        upvote,
      },
    });
  }

  revalidatePath('/');
}
