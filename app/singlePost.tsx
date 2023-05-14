import { Post } from "@prisma/client";
import { Voting } from "./voting";

export default function SinglePost(props: { post: Post }) {
  const { post } = props;

  return (
    <div className="flex p-2 gap-4">
      <Voting post={post} />
      <div
        id={post.id.toString()}
        className="flex flex-col w-11/12 gap-1 justify-between"
      >
        <div className="flex gap-2 items-end">
          <div>
            <a href={`#${post.id}`} className="text-xs text-zinc-500">
              {post.createdAt.toDateString()}
            </a>
            <h2 className="text-2xl -mt-2 font-bold">{post.title}</h2>
          </div>
          <a href={`#${post.id}`} className="text-sm pb-1 text-zinc-500">
            #{post.id.toString().slice(0, 8)}
          </a>
        </div>
        <p className="text-lg overflow-wrap">{post.content}</p>
      </div>
    </div>
  );
}
