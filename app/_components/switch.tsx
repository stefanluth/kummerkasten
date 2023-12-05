'use client';

import { on } from 'events';

import React from 'react';

export function Switch({
  label,
  title,
  checked,
  onSwitch,
}: {
  label: string;
  title: string;
  checked: boolean;
  onSwitch?: (checked: boolean) => void;
}) {
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    onSwitch?.(event.target.checked);
  }

  return (
    <label className="relative inline-flex items-center cursor-pointer" title={title}>
      <input checked={checked} className="sr-only peer" onChange={onChange} type="checkbox" />
      <div className="w-11 h-6 bg-zinc-200 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-700 peer-checked:bg-zinc-400"></div>
      <span className="ms-3 text-sm font-medium text-zinc-900 dark:text-zinc-300">{label}</span>
    </label>
  );
}
