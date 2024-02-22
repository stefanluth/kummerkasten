'use client';

import { PropsWithChildren } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink(props: PropsWithChildren<{ href: string; title?: string; className?: string }>) {
  const isActivePath = props.href === usePathname();

  return (
    <Link
      href={props.href}
      title={props.title}
      className={`${isActivePath && 'underline'} ${props.className} h-6 px-2 rounded-md text-zinc-100 hover:underline`}
      onClick={(e) => e.currentTarget.blur()}
    >
      {props.children ?? props.title}
    </Link>
  );
}
