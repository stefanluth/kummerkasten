import React from "react";

import { prisma } from "@/utils/prisma";

import DisplayPosts from "./displayPosts";

export default async function Home() {
  const posts = await prisma.post.findMany();

  return <DisplayPosts posts={posts} />;
}
