import { prisma } from "@/utils/prisma";
import Posts from "@/app/_components/posts";
import { cookies } from "next/headers";

export default async function TopDay() {
  const password = cookies().get("password")?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return;

  const posts = await prisma.post.findMany({
    orderBy: {
      upvotes: "desc",
    },
  });

  if (posts.length === 0) return <div className="flex p-4 justify-center">No posts found</div>;

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Posts posts={posts} />
    </>
  );
}
