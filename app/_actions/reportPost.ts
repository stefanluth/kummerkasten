'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from '@/utils/prisma';
import { REPORTS_TO_DELETE_POST } from '@/utils';

export async function reportPost(formData: FormData) {
  const fingerprint = cookies().get('fingerprint')?.value;
  const password = cookies().get('password')?.value;
  if (!fingerprint || password !== process.env.UNLOCK_PASSWORD) return redirect('/unlock');

  const postId = formData.get('postId') as string;

  const report = await prisma.report.findFirst({
    where: {
      postId,
      fingerprint,
    },
  });

  if (report) return redirect('/');

  await prisma.report.create({
    data: {
      postId,
      fingerprint,
    },
  });

  const reports = await prisma.report.count({
    where: {
      postId,
    },
  });

  if (reports >= REPORTS_TO_DELETE_POST) {
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }

  revalidatePath('/');
  redirect('/');
}
