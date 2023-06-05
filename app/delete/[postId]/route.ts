import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function DELETE(request: NextRequest, context: { params: { postId: string } }) {
  const password = request.cookies.get('deletePassword')?.value;

  if (!password || password !== process.env.DELETE_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const { postId } = context.params;

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  return NextResponse.json({}, { status: 200 });
}
