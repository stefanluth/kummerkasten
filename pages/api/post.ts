import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const method = req.method;
  switch (method) {
    case "PUT": {
      if (!req.body.id || (!req.body.content && !req.body.title)) {
        res.status(400).json({ message: "Invalid body" });
        return;
      }

      const post = await prisma.post.findUnique({
        where: {
          id: parseInt(req.body.id),
        },
      });

      if (!post) {
        res.status(404).json({ message: "Not found" });
        return;
      }

      await prisma.post.update({
        where: {
          id: parseInt(req.body.id),
        },
        data: {
          title: req.body.title || post.title,
          content: req.body.content || post.content,
        },
      });

      res.status(200).json({ message: "Updated" });
      return;
    }

    case "POST": {
      if (!req.body.title || !req.body.content) {
        res.status(400).json({ message: "Invalid body" });
        return;
      }

      await prisma.post.create({
        data: {
          title: req.body.title,
          content: req.body.content,
        },
      });

      res.status(200).json({ message: "Created" });
      return;
    }

    case "DELETE": {
      if (!req.body.id) {
        res.status(400).json({ message: "Invalid body" });
      }

      await prisma.post.delete({
        where: {
          id: parseInt(req.body.id),
        },
      });

      return;
    }

    default: {
      res.status(404).json({ message: "Not found" });
      return;
    }
  }
}
