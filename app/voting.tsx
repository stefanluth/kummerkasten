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
          const upvoteResponse = await fetch(`/api/post/upvote/${post.id}`, {
            method: "PUT",
          });
          const upvotedPost = await upvoteResponse.json();
          setPost({ ...post, upvotes: upvotedPost.upvotes });
        }}
      >
        <ChevronUpIcon className="w-5" />
      </button>
      <p className="text-center">{post.upvotes}</p>
      <button
        className="flex flex-col items-center gap-1"
        onClick={async () => {
          const downvoteRespone = await fetch(`/api/post/downvote/${post.id}`, {
            method: "PUT",
          });
          const downvotedPost = await downvoteRespone.json();
          setPost({ ...post, upvotes: downvotedPost.upvotes });
        }}
      >
        <ChevronDownIcon className="w-5" />
      </button>
    </div>
  );
}
