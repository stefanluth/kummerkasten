import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function POST(request: NextRequest) {
  const req = await request.json();

  const { postId, fingerprint, upvote } = req;
  if (!fingerprint || typeof fingerprint !== "string" || fingerprint.length !== 64) {
    return NextResponse.json({ message: "Invalid fingerprint" });
  }

  if (typeof upvote !== "boolean") {
    return NextResponse.json({ message: "Invalid vote" });
  }

  if (!postId || typeof postId !== "string") {
    return NextResponse.json({ message: "Invalid post ID" });
  }

  console.log(1);

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  console.log(2);

  if (!post) {
    return NextResponse.json({ message: "Post not found" });
  }

  const votedPost = await prisma.vote.findFirst({
    where: {
      fingerprint,
      postId,
    },
  });

  console.log(3);

  if (votedPost) {
    return NextResponse.json({ message: "Already voted" });
  }

  const upvotedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      upvotes: {
        increment: upvote ? 1 : -1,
      },
    },
  });

  console.log(4);

  await prisma.vote.create({
    data: {
      fingerprint,
      postId,
    },
  });

  console.log(5);

  return NextResponse.json({ ...upvotedPost }, { status: 200 });
}
