import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

import { votePost } from '@/app/_actions/post/vote';

type VotingProps = {
  postId: string;
  score: number;
  viewerVote: boolean | null;
};

export function Voting({ postId, score, viewerVote }: VotingProps) {
  return (
    <div className="flex flex-col justify-center">
      <form>
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="upvote" value="true" />
        <button aria-label="Upvote post" className="flex flex-col items-center gap-1" formAction={votePost}>
          <ChevronUpIcon className={`w-5 ${viewerVote === true ? 'text-zinc-600' : null}`} />
        </button>
      </form>
      <p className="post-score text-center">{score}</p>
      <form>
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="upvote" value="false" />
        <button aria-label="Downvote post" className="flex flex-col items-center gap-1" formAction={votePost}>
          <ChevronDownIcon className={`w-5 ${viewerVote === false ? 'text-zinc-600' : null}`} />
        </button>
      </form>
    </div>
  );
}
