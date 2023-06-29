import { PropsWithChildren } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';

type ModalProps = {
  title: string;
  titleIcon?: JSX.Element;
  onClose: () => void;
};

export function Modal(props: PropsWithChildren<ModalProps>) {
  return (
    <div
      className={`fixed left-0 top-0 z-[1055] h-full w-full overflow-y-auto overflow-x-hidden outline-none bg-neutral-900 bg-opacity-60 backdrop-blur`}
      tabIndex={-1}
    >
      <div className="relative w-auto min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]">
        <div className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
          <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
            {props.titleIcon && props.titleIcon}
            <h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">{props.title}</h5>
            <CloseButton onClose={props.onClose} />
          </div>
          <div className="relative flex-auto p-4">{props.children}</div>
        </div>
      </div>
    </div>
  );
}

function CloseButton(props: { onClose: () => void }) {
  return (
    <button
      type="button"
      className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
      aria-label="Close"
      onClick={props.onClose}
    >
      <XCircleIcon className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
    </button>
  );
}
