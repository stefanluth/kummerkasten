import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

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
