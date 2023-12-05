'use client';

import React from 'react';

export function Switch({
  label,
  checked,
  onSwitch,
}: {
  label: string;
  checked: boolean;
  onSwitch?: (checked: boolean) => void;
}) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        defaultChecked={checked}
        onChange={(event) => {
          onSwitch?.(event.target.checked);
        }}
      />
      <div className="w-11 h-6 bg-zinc-200 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-700 peer-checked:bg-zinc-400"></div>
      <span className="ms-3 text-sm font-medium text-zinc-900 dark:text-zinc-300">{label}</span>
    </label>
  );
}
