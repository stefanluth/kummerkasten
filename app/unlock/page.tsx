'use client';

import React, { useRef } from 'react';

export default function Unlock() {
  const passwordRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col max-w-lg p-4 gap-2 mx-auto">
      <h1>Enter Password</h1>
      <input type="password" name="password" id="password" ref={passwordRef} placeholder="Password" />
      <button
        className="w-fit h-8 px-2 rounded-md bg-zinc-600"
        onClick={() => {
          const password = passwordRef.current?.value;
          if (!password) return;
          document.cookie = `password=${password}; path=/; max-age=86400; secure; samesite=strict;`;
          window.location.href = '/';
        }}
      >
        Unlock
      </button>
    </div>
  );
}
