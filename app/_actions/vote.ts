import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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
      return;
    }

    await prisma.vote.create({
      data: {
        postId,
        fingerprint,
      },
    });

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        upvotes: upvote ? post.upvotes + 1 : post.upvotes - 1,
      },
    });

    revalidatePath('/');
    revalidatePath(`/${postId}`);
    revalidatePath('/top/day');
    revalidatePath('/top/week');
    revalidatePath('/top/month');
    revalidatePath('/top/year');
    revalidatePath('/top/all');
  }
