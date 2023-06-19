'use client';
import React, { useState } from 'react';
import { Modal } from '@/app/_components/modal';

const Confirmation = () => {
  // return (
  //   <div className="flex flex-col max-w-lg p-4 gap-2 mx-auto">
  //     <form>
  //       <div className="bg-zinc-700 rounded-lg p-4 flex flex-col items-center">
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           fill="none"
  //           viewBox="0 0 24 24"
  //           strokeWidth={1.5}
  //           stroke="currentColor"
  //           className="w-6 h-6 text-yellow-500 mb-2"
  //         >
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
  //           />
  //         </svg>

  //         <p className="text-white mb-2">This action will confirm viewing the reported posts.</p>
  //         <button
  //           type="submit"
  //           className="w-fit h-8 px-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-zinc-700 font-bold self-center"
  //         >
  //           Confirm
  //         </button>
  //       </div>
  //     </form>
  //   </div>
  // );
  const [show, setShow] = useState(true);

  if (!show) return null;

  const close = () => setShow(false);

  return (
    <Modal title="Gemeldete Posts anzeigen" close={close}>
      <div className="flex flex-col max-w-lg p-4 gap-2 mx-auto">
        <form onSubmit={close}>
          <div className="bg-zinc-700 rounded-lg p-4 flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-yellow-500 mb-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>

            <p className="text-white mb-2 text-center">
              Durch das Bestätigen werden gemeldete Posts angezeigt, die möglicherweise als verstörend oder unangebracht
              empfunden werden können.
            </p>
            <button
              type="submit"
              className="w-fit h-8 px-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-zinc-700 font-bold self-center"
            >
              Bestätigen
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default Confirmation;
