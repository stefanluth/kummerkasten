import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

import { vote } from '@/app/_actions';

type VotingProps = {
  postId: string;
  upvotes: number;
  fingerprint: string;
  disabled: boolean;
};

export function Voting({ postId, upvotes, disabled }: VotingProps) {
  return (
    <div className="flex flex-col justify-center">
      <form>
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="upvote" value="true" />
        <button className="flex flex-col items-center gap-1" disabled={disabled} formAction={vote}>
          <ChevronUpIcon className={`w-5 ${disabled ? 'text-zinc-600 cursor-not-allowed' : null}`} />
        </button>
      </form>
      <p className="text-center">{upvotes}</p>
      <form>
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="upvote" value="false" />
        <button className="flex flex-col items-center gap-1" disabled={disabled} formAction={vote}>
          <ChevronDownIcon className={`w-5 ${disabled ? 'text-zinc-600 cursor-not-allowed' : null}`} />
        </button>
      </form>
    </div>
  );
}
