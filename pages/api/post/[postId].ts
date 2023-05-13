import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const method = req.method;

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

  if (method === "GET") {
    return res.status(200).json({ ...post });
  }

  if (method === "DELETE") {
    const deletedPost = await prisma.post.delete({
      where: {
        id: parseInt(postId),
      },
    });

    return res.status(200).json({ ...deletedPost });
  }
}
