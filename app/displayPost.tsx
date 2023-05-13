"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { Post } from "@prisma/client";
import { useState } from "react";

export default function DisplayPost(props: { post: Post }) {
  const [post, setPost] = useState<Post>(props.post);

  return (
    <div className="flex p-2 gap-4">
      <div className="flex flex-col justify-center">
        <button
          className="flex flex-col items-center gap-1"
          onClick={async () => {
            const upvotedPost = await fetch(`/api/post/upvote/${post.id}`, {
              method: "PUT",
            });
            setPost(await upvotedPost.json());
          }}
        >
          <ChevronUpIcon className="w-5" />
        </button>
        <p className="text-center">{post.upvotes}</p>
        <button
          className="flex flex-col items-center gap-1"
          onClick={async () => {
            const downvotedPost = await fetch(`/api/post/downvote/${post.id}`, {
              method: "PUT",
            });
            setPost(await downvotedPost.json());
          }}
        >
          <ChevronDownIcon className="w-5" />
        </button>
      </div>
      <div
        id={post.id.toString()}
        className="flex flex-col w-full gap-1 justify-between"
      >
        <div className="flex gap-2 items-end">
          <div>
            <a href={`#${post.id}`} className="text-xs text-zinc-500">
              {post.createdAt.toLocaleDateString()}
            </a>
            <h2 className="text-2xl -mt-2 font-bold">{post.title}</h2>
          </div>
          <a href={`#${post.id}`} className="text-sm pb-1 text-zinc-500">
            #{post.id.toString().slice(0, 8)}
          </a>
        </div>
        <p className="text-lg">{post.content}</p>
      </div>
    </div>
  );
}
