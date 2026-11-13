import { cookies } from 'next/headers';

import { Post } from '@/app/_components/Post';
import { getPostReadModel } from '@/utils/post-read-model';

type PostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PostPage(props: PostPageProps) {
  const { id } = await props.params;
  const fingerprint = (await cookies()).get('fingerprint')?.value;
  const postItem = fingerprint ? await getPostReadModel(id, fingerprint) : null;

  return (
    <div className="flex justify-center">
      <Post post={postItem} />
    </div>
  );
}
