import { PropsWithChildren } from 'react';
import React from 'react';

import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

export function UnlockIcon(props: PropsWithChildren<{ isUnlocked: boolean }>) {
  return (
    <>
      {props.isUnlocked ? (
        <LockOpenIcon className="w-6 h-6 text-zinc-100" />
      ) : (
        <LockClosedIcon className="w-6 h-6 text-zinc-100" />
      )}
      Unlock
    </>
  );
}
