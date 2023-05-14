import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const method = req.method;
  if (method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!req.body.title || !req.body.content) {
    res.status(400).json({ message: "Invalid body" });
    return;
  }

  const createdPost = await prisma.post.create({
    data: {
      title: req.body.title,
      content: req.body.content,
    },
  });

  return res.status(201).json({ ...createdPost });
}
