import React from "react";
import { Post } from "@prisma/client";
import { prisma } from "@/utils/prisma";
import CreatePost from "./createPost";
import Image from "next/image";

import chatBubble from "@/public/assets/chat-bubble.svg";

export default async function Home() {
  const posts: Post[] = await prisma.post.findMany();

  return (
    <div className="flex">
      <Image src={chatBubble} alt="Chat Bubble" />
      <CreatePost />
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title}: {post.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
