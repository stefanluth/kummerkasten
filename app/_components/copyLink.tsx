'use client';

import { join } from 'path';

import { useState } from 'react';

export function CopyLink({ url, path }: { url?: string; path?: string }) {
  const [text, setText] = useState('Copy Link');

  return (
    <button
      className="w-16 hover:underline"
      onClick={() => {
        if (url) {
          navigator.clipboard.writeText(url);
        } else if (path) {
          navigator.clipboard.writeText(join(window.location.origin, path));
        } else {
          return;
        }

        setText('Copied!');
        setTimeout(() => setText('Copy Link'), 2000);
      }}
    >
      {text}
    </button>
  );
}
