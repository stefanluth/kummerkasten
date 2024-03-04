import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

import { votePost } from '@/app/_actions/post/vote';
import { prisma } from '@/utils/prisma';

type VotingProps = {
  postId: string;
  upvotes: number;
  fingerprint: string;
};

export async function Voting({ postId, upvotes, fingerprint }: VotingProps) {
  const userVote = await prisma.vote.findFirst({
    where: {
      fingerprint,
      postId: postId,
    },
  });

  const vote = userVote?.upvote ?? null;

  return (
    <div className="flex flex-col justify-center">
      <form>
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="upvote" value="true" />
        <button className="flex flex-col items-center gap-1" formAction={votePost}>
          <ChevronUpIcon className={`w-5 ${vote === true ? 'text-zinc-600' : null}`} />
        </button>
      </form>
      <p className="text-center">{upvotes}</p>
      <form>
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="upvote" value="false" />
        <button className="flex flex-col items-center gap-1" formAction={votePost}>
          <ChevronDownIcon className={`w-5 ${vote === false ? 'text-zinc-600' : null}`} />
        </button>
      </form>
    </div>
  );
}
