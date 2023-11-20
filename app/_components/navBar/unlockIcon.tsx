import { PropsWithChildren } from 'react';
import React from 'react';

import Link from 'next/link';

import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

export function UnlockIcon(props: PropsWithChildren<{ isUnlocked: boolean }>) {
  return (
    <Link href="/unlock" title="Unlock" className="flex h-6 gap-2 px-2 rounded-md hover:underline">
      {props.isUnlocked ? (
        <LockOpenIcon className="w-6 h-6 text-zinc-100" />
      ) : (
        <LockClosedIcon className="w-6 h-6 text-zinc-100" />
      )}
      {props.children}
    </Link>
  );
}
