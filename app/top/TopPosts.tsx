import { Posts } from '@/app/_components/Post';
import type { TopPeriod } from '@/utils/top-periods';

type TopPostsProps = {
  period: TopPeriod;
};

export function TopPosts({ period }: TopPostsProps) {
  return <Posts period={period} sort="votes" />;
}
