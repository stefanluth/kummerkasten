"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/utils/prisma";

export async function vote({
  postId,
  upvote,
  fingerprint,
}: {
  postId: string;
  upvote: boolean;
  fingerprint: string;
}) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
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

  revalidatePath(`/${postId}`);
  revalidatePath("/");
}
