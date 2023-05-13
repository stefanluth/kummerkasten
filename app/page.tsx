import React from "react";

import { prisma } from "@/utils/prisma";
import DisplayPost from "./displayPost";
import CreatePost from "./createPost";

export default async function Home() {
  const posts = await prisma.post.findMany();

  return (
    <div className="flex flex-col h-full w-2/3 items-center">
      <div className="flex flex-col h-[32rem] gap-2 overflow-y-auto divide-y divide-zinc-700">
        {posts.map((post) => (
          <DisplayPost key={post.id} post={post} />
        ))}
      </div>
      <div className="flex">
        <CreatePost />
      </div>
    </div>
  );
}
