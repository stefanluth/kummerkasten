'use server';

import { sanitize as purify } from 'isomorphic-dompurify';

import { redirect } from 'next/navigation';

import { getEnv } from '@/utils/env';
import { createPostRecord, getPostMutationContext } from '@/utils/post-mutations';
import { parsePostInput } from '@/utils/post-validation';

export async function addPost(formData: FormData) {
  const env = getEnv();
  const context = await getPostMutationContext(false);
  if (!context) return redirect('/unlock');

  const result = parsePostInput(formData, env, (content) => purify(content));
  if ('error' in result) return result.error;

  const creationResult = await createPostRecord(result);
  if (creationResult === 'duplicate') return 'Post already exists.';
  if (creationResult === 'target-not-found') return 'Reply target no longer exists.';

  return null;
}

export async function addPostAction(prevState: unknown, formData: FormData) {
  return await addPost(formData);
}
