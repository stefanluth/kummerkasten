'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'kummerkasten:saved-posts';

export function BookmarkButton({ postId }: { postId: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const savedIds: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      setSaved(Array.isArray(savedIds) && savedIds.includes(postId));
    } catch {
      setSaved(false);
    }
  }, [postId]);

  function toggleSaved() {
    try {
      const savedIds: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      const ids = Array.isArray(savedIds) ? savedIds.filter((id): id is string => typeof id === 'string') : [];
      const nextIds = saved ? ids.filter((id) => id !== postId) : [...new Set([...ids, postId])];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
      setSaved(!saved);
    } catch {
      // Keep the control usable when browser storage is unavailable.
    }
  }

  return (
    <button className="hover:underline" type="button" onClick={toggleSaved}>
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
