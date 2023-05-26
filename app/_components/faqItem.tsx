import { PropsWithChildren } from 'react';

type FaqItemProps = {
  title: string;
};

export default function FaqItem({ title, children }: PropsWithChildren<FaqItemProps>) {
  const href = encodeURIComponent(title);

  return (
    <div className="flex flex-col gap-2">
      <a id={href} href={`#${href}`} className="text-3xl font-bold scroll-m-4">
        {title}
      </a>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
