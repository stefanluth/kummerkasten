import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { vote } from '@/app/_actions';

type VotingProps = {
  postId: string;
  upvotes: number;
  fingerprint: string;
  voted: boolean;
};

export function Voting({ postId, upvotes, voted }: VotingProps) {
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
