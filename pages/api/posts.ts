import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const method = req.method;

  if (method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.status(200).json(posts);
}
