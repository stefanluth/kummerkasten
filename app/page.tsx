'use client'

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { AddPost } from "./_components/addPost";
import { SinglePost } from "./_components/singlePost";
import { SortByComponent } from "./_components/sortBy";
import { Post } from "@prisma/client";

export default async function Home() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [sortBy, setSortBy] = React.useState("createdAt");
  const searchParams = useSearchParams();

  useEffect(() => {
    const sort = searchParams.get("sortBy") ?? "createdAt";
    setSortBy(sort);
  }, [searchParams]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`http://localhost:3000/api/posts?sortBy=${sortBy}`, {
        next: {
          revalidate: 0,
        },
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setPosts(await res.json());
    }

    fetchPosts();
  }, [sortBy]);

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
