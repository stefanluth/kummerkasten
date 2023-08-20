import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/utils/prisma';

// Using POST instead of DELETE because DELETE is not yet supported
// See https://github.com/vercel/next.js/discussions/51011#discussioncomment-6130052
export async function POST(request: NextRequest, context: { params: { id: string } }) {
  const { password } = await request.json();

  if (!password || password !== process.env.DELETE_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const { id } = context.params;

  await prisma.post.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({}, { status: 200 });
}
