'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { PostFeedItem, PostFeedSort, PostFeedVisibility } from '@/utils/post-feed';
import type { PostThreadPage, PostThreadReply } from '@/utils/post-thread';
import type { PostInputLimits } from '@/utils/post-validation';
import type { TopPeriod } from '@/utils/top-periods';

import { Post } from './Post';

type PostFeedProps = {
  initialItems: PostFeedItem[];
  initialThreads: Record<string, PostThreadPage>;
  initialNextCursor: string | null;
  initialReferenceTime: number;
  limits: PostInputLimits;
  period: TopPeriod;
  sort: PostFeedSort;
  visibility: PostFeedVisibility;
};

type SerializedFeedItem = Omit<PostFeedItem, 'createdAt'> & { createdAt: string };
type SerializedThreadReply = Omit<PostThreadReply, 'createdAt'> & { createdAt: string };
type SerializedThreadPage = Omit<PostThreadPage, 'replies'> & { replies: SerializedThreadReply[] };

type SerializedFeedPage = {
  items: SerializedFeedItem[];
  threads: Record<string, SerializedThreadPage>;
  nextCursor: string | null;
  referenceTime: number;
};

export function PostFeed({
  initialItems,
  initialThreads,
  initialNextCursor,
  initialReferenceTime,
  limits,
  period,
  sort,
  visibility,
}: PostFeedProps) {
  const [items, setItems] = useState(initialItems);
  const [threads, setThreads] = useState(initialThreads);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [referenceTime, setReferenceTime] = useState(initialReferenceTime);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const requestInFlightRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (!nextCursor || requestInFlightRef.current) return;

    requestInFlightRef.current = true;
    setIsLoading(true);
    setHasError(false);

    try {
      const params = new URLSearchParams({ cursor: nextCursor, period, sort, visibility });
      const response = await fetch(`/api/posts?${params}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Feed request failed with status ${response.status}`);

      const page = (await response.json()) as SerializedFeedPage;
      const loadedItems = page.items.map((post) => ({ ...post, createdAt: new Date(post.createdAt) }));
      const loadedThreads = Object.fromEntries(
        Object.entries(page.threads).map(([postId, thread]) => [
          postId,
          {
            ...thread,
            replies: thread.replies.map((reply) => ({ ...reply, createdAt: new Date(reply.createdAt) })),
          },
        ]),
      );

      setItems((currentItems) => {
        const existingIds = new Set(currentItems.map((post) => post.id));
        return [...currentItems, ...loadedItems.filter((post) => !existingIds.has(post.id))];
      });
      setThreads((currentThreads) => ({ ...currentThreads, ...loadedThreads }));
      setNextCursor(page.nextCursor);
      setReferenceTime(page.referenceTime);
    } catch {
      setHasError(true);
    } finally {
      requestInFlightRef.current = false;
      setIsLoading(false);
    }
  }, [nextCursor, period, sort, visibility]);

  useEffect(() => {
    setItems(initialItems);
    setThreads(initialThreads);
    setNextCursor(initialNextCursor);
    setReferenceTime(initialReferenceTime);
    setHasError(false);
  }, [initialItems, initialThreads, initialNextCursor, initialReferenceTime]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !nextCursor || hasError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void loadMore();
      },
      { rootMargin: '0px 0px 250px 0px' },
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasError, loadMore, nextCursor]);

  return (
    <>
      {items.length === 0 ? (
        <span className="mx-auto py-8">No posts found.</span>
      ) : (
        <div className="flex flex-col gap-2 divide-y divide-zinc-500 dark:divide-zinc-700">
          {items.map((post) => (
            <Post key={post.id} post={post} thread={threads[post.id]} limits={limits} referenceTime={referenceTime} />
          ))}
        </div>
      )}
      {nextCursor && (
        <div className="mx-auto my-4 flex flex-col items-center gap-2">
          <div ref={sentinelRef} data-feed-sentinel aria-hidden="true" className="h-1 w-full" />
          {hasError ? (
            <p role="alert" className="flex items-center gap-2">
              Could not load more posts.
              <button
                className="rounded-md border border-zinc-500 dark:border-zinc-700 px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                type="button"
                onClick={() => void loadMore()}
              >
                Retry
              </button>
            </p>
          ) : (
            <button
              className="rounded-md border border-zinc-500 dark:border-zinc-700 px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              disabled={isLoading}
              onClick={() => void loadMore()}
            >
              {isLoading ? 'Loading more posts…' : 'Load more'}
            </button>
          )}
          <span className="sr-only" aria-live="polite">
            {isLoading ? 'Loading more posts.' : ''}
          </span>
        </div>
      )}
    </>
  );
}
