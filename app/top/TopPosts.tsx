import { Posts } from '@/app/_components/Post';
import type { TopPeriod } from '@/utils/top-periods';

export type TopPostsPageProps = {
  searchParams: Promise<{ cursor?: string | string[] }>;
};

type TopPostsProps = TopPostsPageProps & {
  period: TopPeriod;
};

export async function TopPosts({ period, searchParams }: TopPostsProps) {
  const { cursor } = await searchParams;

  return (
    <Posts
      href={`/top/${period}`}
      cursor={typeof cursor === 'string' ? cursor : undefined}
      period={period}
      sort="votes"
    />
  );
}
