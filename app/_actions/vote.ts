import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Vote } from "@/utils";

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

  const sameVote = (isUpvote && vote?.value === Vote.Up) || (!isUpvote && vote?.value === Vote.Down);
  const firstVote = vote?.value === Vote.Remove || vote?.value === undefined;

  const undoVote = isUpvote ? post.upvotes - 1 : post.upvotes + 1;
  const increaseVote = isUpvote ? post.upvotes + 1 : post.upvotes - 1;
  const undoAndIncreaseVote = isUpvote ? post.upvotes + 2 : post.upvotes - 2;

  let newUpvotes;

  switch (true) {
    case sameVote:
      newUpvotes = undoVote;
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
        value: sameVote === true ? Vote.Remove
        : isUpvote === true ? Vote.Up
        : Vote.Down
      },
    });
  } else {
    await prisma.vote.create({
      data: {
        postId,
        fingerprint,
        value: isUpvote === true
        ? Vote.Up
        : Vote.Down
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
