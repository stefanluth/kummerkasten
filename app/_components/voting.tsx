import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

import prisma from "@/utils/prisma";

type VotingProps = {
  postId: string;
  upvotes: number;
  fingerprint: string;
  disabled: boolean;
};

export function Voting({ postId, upvotes, disabled }: VotingProps) {
  async function vote(formData: FormData) {
    "use server";

    const postId = formData.get("postId") as string;
    const upvote = formData.get("upvote") === "true";
    const fingerprint = cookies().get("fingerprint")?.value;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post || !fingerprint) {
      return;
    }

    const vote = await prisma.vote.findFirst({
      where: {
        postId,
        fingerprint,
      },
    });

    if (vote) {
      return;
    }

    await prisma.vote.create({
      data: {
        postId,
        fingerprint,
      },
    });

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        upvotes: upvote ? post.upvotes + 1 : post.upvotes - 1,
      },
    });

    revalidatePath("/");
  }

  return (
    <div className="flex flex-col justify-center">
      <form>
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="upvote" value="true" />
        <button className="flex flex-col items-center gap-1" disabled={disabled} formAction={vote}>
          <ChevronUpIcon className={`w-5 ${disabled ? "text-zinc-600 cursor-not-allowed" : null}`} />
        </button>
      </form>
      <p className="text-center">{upvotes}</p>
      <form>
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="upvote" value="false" />
        <button className="flex flex-col items-center gap-1" disabled={disabled} formAction={vote}>
          <ChevronDownIcon className={`w-5 ${disabled ? "text-zinc-600 cursor-not-allowed" : null}`} />
        </button>
      </form>
    </div>
  );
}
