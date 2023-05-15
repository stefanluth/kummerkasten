import React from "react";

import { prisma } from "@/utils/prisma";
import { AddPost } from "./components/addPost";
import { SinglePost } from "./components/singlePost";
import { SortByComponent } from "./components/sortBy";

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="overflow-y-auto pb-4">
      <div className="flex flex-col min-w-[30rem] max-w-6xl mx-auto">
        <AddPost />
        {/* TODO think of a way to get sortBy working again */}
        <SortByComponent />
        <div className="flex flex-col gap-2 divide-y divide-zinc-700">
          {posts.map((post) => (
            /* @ts-expect-error Server Component */
            <SinglePost key={post.id} postId={post.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
