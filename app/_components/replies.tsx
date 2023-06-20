import Link from 'next/link';
import { Post } from '@prisma/client';
import { Voting } from './voting';

export async function Replies({ replies }: { replies: Post[] }) {
  return (
    <>
      <div className={'flex flex-col gap-2 mt-2 divide-y divide-zinc-700'}>
        {replies.map((reply) => {
          return (
            <>
              <div key={reply.id} className="flex flex-col gap-1">
                <div className="flex gap-2 items-baseline">
                  <a href={`#${reply.id}`} id={reply.id} className="text-xs mt-2 text-zinc-500 scroll-m-4">
                    {reply.createdAt.toDateString()}
                  </a>
                  <Link href={reply.replyTo ?? ''} className="text-xs text-zinc-500">
                    @{reply.replyTo?.slice(0, 8)}
                  </Link>
                  <Link href={reply.id} className="text-xs text-zinc-500">
                    #{reply.id.toString().slice(0, 8)}
                  </Link>
                </div>
                <p className="text-md">{reply.content}</p>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}
