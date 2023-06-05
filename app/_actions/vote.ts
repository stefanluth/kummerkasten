import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function vote(formData: FormData) {
  'use server';

  const postId = formData.get('postId') as string;
  const isUpvote = formData.get('upvote') === 'true';
  const fingerprint = cookies().get('fingerprint')?.value;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post || !fingerprint) {
    return;
  }

  let vote = await prisma.vote.findFirst({
    where: {
      postId,
      fingerprint,
    },
  });

  const sameVote = vote?.isUpvote === isUpvote;
  const firstVote = vote?.isUpvote === undefined;

  const undoVote = isUpvote ? post.upvotes - 1 : post.upvotes + 1;
  const increaseVote = isUpvote ? post.upvotes + 1 : post.upvotes - 1;
  const undoAndIncreaseVote = isUpvote ? post.upvotes + 2 : post.upvotes - 2;

  let newUpvotes;

  switch (true) {
    case sameVote:
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          upvotes: undoVote,
        },
      });

      await prisma.vote.delete({
        where: {
          id: vote?.id
        }
      });

      break;

    case firstVote:
      newUpvotes = increaseVote;
      break;

    default:
      newUpvotes = undoAndIncreaseVote;
  }

  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      upvotes: newUpvotes,
    },
  });

  vote = await prisma.vote.findFirst({
    where: {
      postId,
      fingerprint,
    },
  });

  if (vote) {
    await prisma.vote.update({
      where: {
        id: vote?.id,
      },
      data: {
        postId,
        fingerprint,
        isUpvote
      },
    });
  } else if (!sameVote) {
    await prisma.vote.create({
      data: {
        postId,
        fingerprint,
        isUpvote
      },
    });
  }

    revalidatePath('/');
    revalidatePath(`/${postId}`);
    revalidatePath('/top/day');
    revalidatePath('/top/week');
    revalidatePath('/top/month');
    revalidatePath('/top/year');
    revalidatePath('/top/all');
  }
