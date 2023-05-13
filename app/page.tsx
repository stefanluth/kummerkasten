import React from "react";

import { prisma } from "@/utils/prisma";

import AllPosts from "./allPosts";

export default async function Home() {
  const posts = await prisma.post.findMany();

  return <AllPosts posts={posts} />;
}
