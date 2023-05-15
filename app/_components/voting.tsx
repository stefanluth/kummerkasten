"use client";

import { useTransition } from "react";
import { vote } from "../_actions/vote";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { getFingerprintFromCookie } from "@/utils";

type VotingProps = {
  postId: string;
  upvotes: number;
  fingerprint: string;
  disabled: boolean;
};

export function Voting({ postId, upvotes, disabled }: VotingProps) {
  const [isPending, startTransition] = useTransition();
  const fingerprint = getFingerprintFromCookie(document.cookie);

  return (
    <div className="flex flex-col justify-center">
      <button
        className="flex flex-col items-center gap-1"
        disabled={disabled}
        onClick={() => startTransition(() => vote({ postId, upvote: true, fingerprint }))}
      >
        <ChevronUpIcon className={`w-5 ${disabled ? "text-zinc-600 cursor-not-allowed" : null}`} />
      </button>
      <p className="text-center">{upvotes}</p>
      <button
        className="flex flex-col items-center gap-1"
        disabled={disabled}
        onClick={() => startTransition(() => vote({ postId, upvote: false, fingerprint }))}
      >
        <ChevronDownIcon className={`w-5 ${disabled ? "text-zinc-600 cursor-not-allowed" : null}`} />
      </button>
    </div>
  );
}
