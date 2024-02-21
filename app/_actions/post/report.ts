'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { prisma } from '@/utils/prisma';

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

  revalidatePath('/');
}

export async function reportPostAction(prevState: any, formData: FormData) {
  return await reportPost(formData);
}
