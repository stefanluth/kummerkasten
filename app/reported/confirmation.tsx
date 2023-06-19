'use client';

import React, { useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Modal } from '@/app/_components/modal';

export default function Confirmation() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  const close = () => setShow(false);

  return (
    <Modal title="Gemeldete Nachrichten anzeigen" close={close}>
      <form onSubmit={close}>
        <div className="flex flex-col items-center">
          <ExclamationTriangleIcon title="Warnung" className="w-6 h-6 text-yellow-500 mb-2" />
          <p className="text-white mb-2 text-center">
            Durch das Bestätigen werden gemeldete Nachrichten angezeigt, die möglicherweise als verstörend oder
            unangebracht empfunden werden können.
          </p>
          <button
            type="submit"
            className="w-fit h-8 px-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-zinc-700 font-bold self-center"
          >
            Bestätigen
          </button>
        </div>
      </form>
    </Modal>
  );
}
