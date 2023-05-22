import React from "react";

import { prisma } from "@/utils/prisma";
import { AddPost } from "@/app/_components/addPost";
import { SinglePost } from "@/app/_components/singlePost";
import { cookies } from "next/headers";

export default async function Home() {
  const password = cookies().get("password")?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return;

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="overflow-y-auto pb-4">
      <div className="flex flex-col min-w-[30rem] max-w-6xl mx-auto">
        <AddPost />
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
