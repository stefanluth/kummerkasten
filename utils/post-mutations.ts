import 'server-only';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { Prisma } from '@/generated/prisma/client';
import { SESSION_COOKIE_NAME, verifyUnlockSessionToken } from '@/utils/auth-session';
import { getEnv } from '@/utils/env';
import { prisma } from '@/utils/prisma';

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

export async function createPostRecord(input: ValidPostInput): Promise<boolean> {
  const existingPost = await prisma.post.findFirst({
    where: { title: input.title, content: input.content },
    select: { id: true },
  });

  if (existingPost) return false;

  await prisma.post.create({
    data: {
      title: input.title,
      content: input.content,
      replyTo: input.replyTo,
    },
  });

  revalidatePostViews();
  return true;
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

      if (updated) revalidatePostViews(postId);
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

  revalidatePostViews(postId);
  return true;
}

export function revalidatePostViews(postId?: string): void {
  revalidatePath('/');
  for (const path of TOP_PATHS) revalidatePath(path);
  revalidatePath('/reported');
  if (postId) revalidatePath(`/${postId}`);
}

function isTransactionConflict(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && (error.code === 'P2034' || error.code === 'P2002');
}
