'use server';

import { redirect } from 'next/navigation';

import { createPostReport, getPostMutationContext } from '@/utils/post-mutations';

export async function reportPost(formData: FormData) {
  const rawPostId = formData.get('postId');
  if (typeof rawPostId !== 'string' || !rawPostId) return;

  const context = await getPostMutationContext();
  if (!context?.fingerprint) return redirect('/unlock');

  const created = await createPostReport(rawPostId, context.fingerprint);
  if (!created) return redirect('/');
}

export async function reportPostAction(prevState: unknown, formData: FormData) {
  return await reportPost(formData);
}
