'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Confirmation() {
  const [show, setShow] = useState(true);
  const router = useRouter();

  const onDeny = () => router.push('/');
  const onConfirm = () => setShow(false);

  return show ? (
    <div
      className="absolute top-0 left-0 w-full h-full z-[1337] bg-neutral-900 bg-opacity-60 backdrop-blur"
      tabIndex={-1}
    >
      <div className="flex flex-col w-fit h-full justify-center mx-auto gap-4">
        <div className="flex flex-col text-center gap-2">
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto text-yellow-500" />
          <p>This page contains reported messages that may be perceived as disturbing or inappropriate.</p>
          <p>
            By clicking <b>Continue</b>, you confirm that you are aware of this fact and want to read the messages.
          </p>
        </div>
        <div className="flex mx-auto gap-2">
          <button
            className="w-28 h-8 px-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-zinc-900 font-bold self-center"
            onClick={onConfirm}
          >
            Continue
          </button>
          <button
            className="w-28 h-8 px-2 rounded-md bg-zinc-700 hover:bg-zinc-800 text-white font-bold self-center"
            autoFocus
            onClick={onDeny}
          >
            Abort
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
