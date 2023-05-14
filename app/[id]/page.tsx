import { prisma } from "@/utils/prisma";
import SinglePost from "../singlePost";

type SinglePostPageProps = {
  params: {
    id: string;
  };
};

export default async function SinglePostPage(props: SinglePostPageProps) {
  const post = await prisma.post.findUnique({
    where: {
      id: props.params.id,
    },
  });

  return (
    <div className="flex w-2/3 self-center justify-center">
      <div>{post && <SinglePost post={post} />}</div>
    </div>
  );
}
