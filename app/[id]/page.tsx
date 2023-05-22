import { SinglePost } from "@/app/_components/singlePost";

type SinglePostPageProps = {
  params: {
    id: string;
  };
};

export default async function SinglePostPage(props: SinglePostPageProps) {
  return (
    <div className="flex w-2/3 self-center justify-center">
      <div>
        {/* @ts-expect-error Server Component */}
        <SinglePost postId={props.params.id} />
      </div>
    </div>
  );
}
