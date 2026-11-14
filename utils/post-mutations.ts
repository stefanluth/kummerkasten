import 'server-only';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { Prisma } from '@/generated/prisma/client';
import { SESSION_COOKIE_NAME, verifyUnlockSessionToken } from '@/utils/auth-session';
import { getEnv } from '@/utils/env';
import { prisma } from '@/utils/prisma';

import { getPostThreadRootId } from './post-thread';
import type { ValidPostInput } from './post-validation';

const TOP_PATHS = ['/top/day', '/top/week', '/top/month', '/top/year', '/top/all'];
const SERIALIZATION_RETRIES = 3;

export type PostMutationContext = {
  fingerprint: string | null;
};

export async function getPostMutationContext(requireFingerprint = true): Promise<PostMutationContext | null> {
  const cookieStore = await cookies();
  const env = getEnv();

  if (!(await verifyUnlockSessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value, env.sessionSecret))) return null;

  const fingerprint = cookieStore.get('fingerprint')?.value ?? null;
  if (requireFingerprint && !fingerprint) return null;

  return { fingerprint };
}

type CreatePostResult = 'duplicate' | 'target-not-found' | null;

export async function createPostRecord(input: ValidPostInput): Promise<CreatePostResult> {
  const replyTo = input.replyTo ?? null;
  const threadRootId = replyTo ? await getPostThreadRootId(replyTo) : null;
  if (replyTo && !threadRootId) return 'target-not-found';

  const threadRoot = threadRootId
    ? await prisma.post.findUnique({ where: { id: threadRootId }, select: { title: true } })
    : null;
  if (threadRootId && !threadRoot) return 'target-not-found';

  const title = input.title ?? threadRoot?.title;
  if (!title) return 'target-not-found';

  const existingPost = await prisma.post.findFirst({
    where: { title, content: input.content, replyTo },
    select: { id: true },
  });

  if (existingPost) return 'duplicate';

  try {
    await prisma.post.create({ data: { title, content: input.content, replyTo } });
  } catch (error) {
    if (replyTo && isMissingReplyTarget(error)) return 'target-not-found';
    throw error;
  }

  revalidatePostViews(threadRootId ?? undefined);
  if (replyTo && replyTo !== threadRootId) revalidatePath(`/${replyTo}`);
  return null;
}

export async function togglePostVote(postId: string, fingerprint: string, upvote: boolean): Promise<void> {
  for (let attempt = 0; attempt < SERIALIZATION_RETRIES; attempt += 1) {
    try {
      const updated = await prisma.$transaction(
        async (transaction) => {
          const post = await transaction.post.findUnique({ where: { id: postId }, select: { id: true } });
          if (!post) return false;

          const where = { postId_fingerprint: { postId, fingerprint } };
          const existingVote = await transaction.vote.findUnique({ where, select: { upvote: true } });

          if (existingVote?.upvote === upvote) {
            await transaction.vote.delete({ where });
          } else {
            await transaction.vote.upsert({
              where,
              create: { postId, fingerprint, upvote },
              update: { upvote },
            });
          }

          return true;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );

      if (updated) await revalidatePostThreadViews(postId);
      return;
    } catch (error) {
      if (!isTransactionConflict(error) || attempt === SERIALIZATION_RETRIES - 1) throw error;
    }
  }
}

export async function createPostReport(postId: string, fingerprint: string): Promise<boolean> {
  const result = await prisma.report.createMany({
    data: [{ postId, fingerprint }],
    skipDuplicates: true,
  });

  if (result.count === 0) return false;

  await revalidatePostThreadViews(postId);
  return true;
}

export function revalidatePostViews(postId?: string): void {
  revalidatePath('/');
  for (const path of TOP_PATHS) revalidatePath(path);
  revalidatePath('/reported');
  if (postId) revalidatePath(`/${postId}`);
}

async function revalidatePostThreadViews(postId: string): Promise<void> {
  const rootPostId = await getPostThreadRootId(postId);
  revalidatePostViews(rootPostId ?? postId);
  if (rootPostId && rootPostId !== postId) revalidatePath(`/${postId}`);
}

function isTransactionConflict(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && (error.code === 'P2034' || error.code === 'P2002');
}

function isMissingReplyTarget(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003';
}
