"use client";

import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Post } from "@prisma/client";
import { useState } from "react";

export function Voting(props: { post: Post }) {
  const [post, setPost] = useState(props.post);

  return (
    <div className="flex flex-col justify-center">
      <button
        className="flex flex-col items-center gap-1"
        onClick={async () => {
          const upvotedPost = await fetch(`/api/post/upvote/${post.id}`, {
            method: "PUT",
          });
          const newPost = await upvotedPost.json();
          setPost({ ...post, upvotes: newPost.upvotes });
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
          const newPost = await downvotedPost.json();
          setPost({ ...post, upvotes: newPost.upvotes });
        }}
      >
        <ChevronDownIcon className="w-5" />
      </button>
    </div>
  );
}
