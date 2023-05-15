import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function POST(request: NextRequest) {
  const req = await request.json();

  if (!req.title || !req.content) {
    return NextResponse.json({ message: "Invalid title or content" }, { status: 400 });
  }

  const createdPost = await prisma.post.create({
    data: {
      title: req.title,
      content: req.content,
    },
  });

  return NextResponse.json({ ...createdPost }, { status: 201 });
}
