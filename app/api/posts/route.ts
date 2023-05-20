import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function POST(request: NextRequest) {
  const data = await request.json()
  const { title, content } = data;

  if (!title || !content) {
    return NextResponse.json({ message: "Invalid title or content" }, { status: 400 });
  }

  const createdPost = await prisma.post.create({
    data: {
      title: title,
      content: content,
    },
  });

  return NextResponse.json(createdPost, { status: 201 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.nextUrl)
  const sortBy = searchParams.get('sortBy') || 'createdAt'

  const posts = await prisma.post.findMany({
    orderBy: {
      [sortBy]: "desc",
    },
  });

  return NextResponse.json(posts);
}
