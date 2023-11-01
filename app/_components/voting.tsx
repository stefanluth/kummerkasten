import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

import { votePost } from '@/app/_actions/post/vote';

type VotingProps = {
  postId: string;
  upvotes: number;
  fingerprint: string;
  vote: boolean | null;
};

export function Voting({ postId, upvotes, vote }: VotingProps) {
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
