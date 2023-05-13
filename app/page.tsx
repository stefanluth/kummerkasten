import React from "react";

import { prisma } from "@/utils/prisma";
import DisplayPost from "./displayPost";
import CreatePost from "./createPost";

export default async function Home() {
  const posts = await prisma.post.findMany();

  return (
    <div className="overflow-y-auto">
      <div className="flex flex-col min-w-[30rem] max-w-6xl mx-auto">
        <CreatePost />
        <div className="flex flex-col gap-2 divide-y divide-zinc-700">
          {posts
            .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
            .map((post) => (
              <DisplayPost key={post.id} post={post} />
            ))}
        </div>
      </div>
    </div>
  );
}
