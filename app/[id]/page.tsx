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
    <div className="flex justify-center align-middle">
      <div>{post && <SinglePost post={post} />}</div>
    </div>
  );
}
