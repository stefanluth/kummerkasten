'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

const STORAGE_KEY = 'kummerkasten:saved-posts';

export function SavedPosts() {
  const [postIds, setPostIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedIds: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      setPostIds(Array.isArray(savedIds) ? savedIds.filter((id): id is string => typeof id === 'string') : []);
    } catch {
      setPostIds([]);
    }
  }, []);

  function removePost(postId: string) {
    const nextIds = postIds.filter((id) => id !== postId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
    setPostIds(nextIds);
  }

  return (
    <section className="flex flex-col gap-3 p-2">
      <h1 className="text-2xl font-bold">Saved posts</h1>
      {postIds.length === 0 ? (
        <p className="py-4 text-zinc-400">No saved posts yet.</p>
      ) : (
        postIds.map((id) => (
          <div key={id} className="flex items-center justify-between border-b border-zinc-700 py-3">
            <Link className="hover:underline" href={`/${encodeURIComponent(id)}`}>
              Post {id}
            </Link>
            <button className="text-zinc-400 hover:underline" type="button" onClick={() => removePost(id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </section>
  );
}
