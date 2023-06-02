import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

import { prisma } from '@/utils/prisma';

type VotingProps = {
  postId: string;
  upvotes: number;
  fingerprint: string;
  voted: boolean;
};

export function Voting({ postId, upvotes, voted }: VotingProps) {
  async function vote(formData: FormData) {
    'use server';

    const postId = formData.get('postId') as string;
    const isUpvote = formData.get('upvote') === 'true';
    const fingerprint = cookies().get('fingerprint')?.value;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post || !fingerprint) {
      return;
    }

    let vote = await prisma.vote.findFirst({
      where: {
        postId,
        fingerprint,
      },
    });

    const sameVote = vote?.isUpvote === isUpvote;
    const firstVote = vote?.isUpvote === undefined;

    const undoVote = isUpvote ? post.upvotes - 1 : post.upvotes + 1;
    const increaseVote = isUpvote ? post.upvotes + 1 : post.upvotes - 1;
    const undoAndIncreaseVote = isUpvote ? post.upvotes + 2 : post.upvotes - 2;

    switch (true) {
      case sameVote:
        await prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            upvotes: undoVote,
          },
        });
        await prisma.vote.delete({
          where: {
            id: vote?.id
          }
        });
        break;

      case firstVote:
        await prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            upvotes: increaseVote,
          },
        });
        break;

      default:
        await prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            upvotes: undoAndIncreaseVote,
          },
        });
    }

    vote = await prisma.vote.findFirst({
      where: {
        postId,
        fingerprint,
      },
    });

    if (vote) {
      await prisma.vote.update({
        where: {
          id: vote?.id,
        },
        data: {
          postId,
          fingerprint,
          isUpvote
        },
      });
    } else if (!sameVote) {
      await prisma.vote.create({
        data: {
          postId,
          fingerprint,
          isUpvote
        },
      });
    }

    revalidatePath('/');
  }

  return (
    <div className="flex flex-col justify-center">
      <form>
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="upvote" value="true" />
        <button className="flex flex-col items-center gap-1" formAction={vote}>
          <ChevronUpIcon className={`w-5 ${voted ? 'text-zinc-600' : null}`} />
        </button>
      </form>
      <p className="text-center">{upvotes}</p>
      <form>
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="upvote" value="false" />
        <button className="flex flex-col items-center gap-1" formAction={vote}>
          <ChevronDownIcon className={`w-5 ${voted ? 'text-zinc-600' : null}`} />
        </button>
      </form>
    </div>
  );
}
