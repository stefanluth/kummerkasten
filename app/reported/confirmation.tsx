'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import { Modal } from '@/app/_components/modal';

export default function Confirmation() {
  const [show, setShow] = useState(true);
  const router = useRouter();

  if (!show) return null;

  const onDeny = () => {
    setShow(false);
    router.push('/');
  };

  const onConfirm = () => {
    setShow(false);
  };

  return (
    <Modal
      title="Gemeldete Nachrichten anzeigen"
      titleIcon={<ExclamationTriangleIcon title="Warnung" className="w-8 h-8 text-yellow-500" />}
      onClose={onDeny}
    >
      <form onSubmit={onConfirm}>
        <div className="flex flex-col items-center">
          <p className="text-white mb-2 text-center">
            Durch das Bestätigen werden gemeldete Nachrichten angezeigt, die möglicherweise als verstörend oder
            unangebracht empfunden werden können.
          </p>
          <div className="flex flex-col md:flex-row gap-2 justify-center w-full md:w-auto">
            <button
              type="submit"
              className="w-fit h-8 px-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-zinc-700 font-bold self-center"
            >
              Bestätigen
            </button>
            <button
              type="button"
              className="w-fit h-8 px-2 rounded-md bg-zinc-700 hover:bg-zinc-800 text-white font-bold self-center"
              onClick={onDeny}
            >
              Abbrechen
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
