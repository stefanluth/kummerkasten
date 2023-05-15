"use client";

import { useRouter } from "next/navigation";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

type VotingProps = {
  postId: string;
  upvotes: number;
  fingerprint: string;
  disabled: boolean;
};

async function vote(postId: string, fingerprint: string, upvote: boolean) {
  await fetch("/api/vote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId, fingerprint, upvote }),
  });
}

export function Voting(props: VotingProps) {
  const router = useRouter();
  const { postId, upvotes, disabled } = props;

  return (
    <div className="flex flex-col justify-center">
      <button
        className="flex flex-col items-center gap-1"
        disabled={disabled}
        onClick={async () => {
          await vote(postId, props.fingerprint, true);
          // TODO: is this a hacky way? flickers in dev mode, but looks good after build
          router.refresh();
        }}
      >
        <ChevronUpIcon className={`w-5 ${disabled ? "text-zinc-600 cursor-not-allowed" : null}`} />
      </button>
      <p className="text-center">{upvotes}</p>
      <button
        className="flex flex-col items-center gap-1"
        disabled={disabled}
        onClick={async () => {
          await vote(postId, props.fingerprint, false);
          router.refresh();
        }}
      >
        <ChevronDownIcon className={`w-5 ${disabled ? "text-zinc-600 cursor-not-allowed" : null}`} />
      </button>
    </div>
  );
}
