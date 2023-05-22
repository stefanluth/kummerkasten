import React from "react";

import { Post } from "@prisma/client";
import { SinglePost } from "@/app/_components/singlePost";

export default async function Posts({ posts }: { posts: Post[] }) {
  return (
    <div className="flex flex-col gap-2 divide-y divide-zinc-700">
      {posts.map((post) => (
        /* @ts-expect-error Server Component */
        <SinglePost key={post.id} postId={post.id} />
      ))}
    </div>
  );
}
