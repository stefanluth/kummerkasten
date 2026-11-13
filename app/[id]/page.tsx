import { cookies } from 'next/headers';

import { Post } from '@/app/_components/Post';
import { prisma } from '@/utils/prisma';

type PostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PostPage(props: PostPageProps) {
  const { id } = await props.params;
  const fingerprint = (await cookies()).get('fingerprint')?.value;

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      reports: true,
      votes: true,
    },
  });

  const postItem =
    post && fingerprint
      ? {
          id: post.id,
          title: post.title,
          content: post.content,
          replyTo: post.replyTo,
          createdAt: post.createdAt,
          score: post.votes.reduce((score, vote) => score + (vote.upvote ? 1 : -1), 0),
          reportCount: post.reports.length,
          viewerVote: post.votes.find((vote) => vote.fingerprint === fingerprint)?.upvote ?? null,
          viewerReported: post.reports.some((report) => report.fingerprint === fingerprint),
        }
      : null;

  return (
    <div className="flex justify-center">
      <Post post={postItem} />
    </div>
  );
}
