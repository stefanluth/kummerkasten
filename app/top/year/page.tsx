import { TopPosts } from '@/app/top/TopPosts';
import type { TopPostsPageProps } from '@/app/top/TopPosts';

export default function TopYear(props: TopPostsPageProps) {
  return <TopPosts {...props} period="year" />;
}
