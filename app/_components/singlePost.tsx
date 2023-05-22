import Link from "next/link";
import { cookies } from "next/headers";

import { prisma } from "@/utils/prisma";
import { Voting } from "./voting";

export async function SinglePost(props: { postId: string }) {
  const postPromise = prisma.post.findUnique({
    where: {
      id: props.postId,
    },
  });

  const fingerprint = cookies().get("fingerprint")?.value;
  if (!fingerprint) {
    return <p>Something went wrong. Try refreshing the page.</p>;
  }

  const votedPromise = prisma.vote.findFirst({
    where: {
      fingerprint,
      postId: props.postId,
    },
  });

  const [post, voted] = await Promise.all([postPromise, votedPromise]);

  if (!post) {
    return <p>Post not found.</p>;
  }

  const disabled = !!voted;

  return (
    <div className="flex p-2 gap-4">
      <Voting postId={post.id} upvotes={post.upvotes} disabled={disabled} fingerprint={fingerprint} />
      <div id={post.id.toString()} className="flex flex-col w-11/12 gap-1 justify-between">
        <div className="flex gap-2 items-end">
          <div>
            <a href={`#${post.id}`} className="text-xs text-zinc-500">
              {post.createdAt.toDateString()}
            </a>
            <h2 className="text-2xl -mt-2 font-bold">{post.title}</h2>
          </div>
          <Link href={`${post.id}`} className="text-sm pb-1 text-zinc-500">
            #{post.id.toString().slice(0, 8)}
          </Link>
        </div>
        <p className="text-lg overflow-wrap">{post.content}</p>
      </div>
    </div>
  );
}
