'use server';

import { getPostMutationContext, togglePostVote } from '@/utils/post-mutations';

export async function votePost(formData: FormData) {
  const rawPostId = formData.get('postId');
  const rawUpvote = formData.get('upvote');
  if (typeof rawPostId !== 'string' || !rawPostId || (rawUpvote !== 'true' && rawUpvote !== 'false')) return;

  const context = await getPostMutationContext();
  if (!context?.fingerprint) return;

  await togglePostVote(rawPostId, context.fingerprint, rawUpvote === 'true');
}
