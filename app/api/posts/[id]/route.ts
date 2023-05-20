import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });

  return NextResponse.json(post);
}
