import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const method = req.method;
  if (method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { postId } = req.query;
  if (!postId || typeof postId !== "string") {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(postId),
    },
  });

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const upvotedPost = await prisma.post.update({
    where: {
      id: parseInt(postId),
    },
    data: {
      upvotes: post.upvotes + 1,
    },
  });

  res.status(200).json({ ...upvotedPost });
}
