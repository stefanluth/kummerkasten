import { cookies } from 'next/headers';

import { Post } from '@/app/_components/Post';
import { getPostReadModel } from '@/utils/post-read-model';
import { getPostThreadReplies, getPostThreadRootId } from '@/utils/post-thread';

type PostPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function PostPage(props: PostPageProps) {
  const [{ id }, { replyPage: rawReplyPage }] = await Promise.all([props.params, props.searchParams]);
  const requestedPage = Number(typeof rawReplyPage === 'string' ? rawReplyPage : undefined);
  const replyPage = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const fingerprint = (await cookies()).get('fingerprint')?.value;
  const requestedPost = fingerprint ? await getPostReadModel(id, fingerprint) : null;
  const rootPostId = requestedPost?.replyTo ? await getPostThreadRootId(id) : requestedPost?.id;
  const postItem = rootPostId && rootPostId !== id ? await getPostReadModel(rootPostId, fingerprint) : requestedPost;
  const thread = rootPostId
    ? (await getPostThreadReplies([rootPostId], fingerprint, 'public', replyPage)).get(rootPostId)
    : undefined;

  return (
    <div className="flex justify-center">
      <Post post={postItem} thread={thread} replyPage={replyPage} />
    </div>
  );
}
