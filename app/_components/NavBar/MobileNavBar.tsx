'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Bars3Icon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { Logo } from '../Logo';
import { NavLink } from './NavLink';
import { UnlockIcon } from './UnlockIcon';

export function MobileNavBar(props: { isUnlocked: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="md:hidden flex">
        <Logo />
      </div>

      <div className="md:hidden flex gap-4 items-center">
        <NavLink href="/unlock" className="flex gap-2 px-2">
          <UnlockIcon isUnlocked={props.isUnlocked} />
        </NavLink>
        <Link href="/faq" title="FAQ" className="flex h-7 gap-2 px-2 rounded-md" onClick={() => setIsOpen(false)}>
          <InformationCircleIcon className="w-7 h-7 text-zinc-100" />
        </Link>
        <button className="relative h-8 w-8" onClick={() => setIsOpen(!isOpen)}>
          <Bars3Icon
            className={`transition-opacity duration-300 absolute top-0 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
          />
          <XMarkIcon
            className={`transition-opacity duration-300 absolute top-0 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          />
        </button>
      </div>
      <div
        className={`bg-gradient-to-r from-transparent via-zinc-800 to-zinc-800 backdrop-blur-sm fixed top-0 right-0 h-screen w-screen mt-14 z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div
          className="flex flex-col gap-2 border-t-[1px] pt-2 border-zinc-500 border-collapse"
          onClick={() => setIsOpen(false)}
        >
          <MobileMenuElement href="/top/day" title="24h" />
          <MobileMenuElement href="/top/week" title="7d" />
          <MobileMenuElement href="/top/month" title="30d" />
          <MobileMenuElement href="/top/year" title="1y" />
          <MobileMenuElement href="/top/all" title="All" />
        </div>
      </div>
    </>
  );
}

const MobileMenuElement = ({ href, title }: { href: string; title: string }) => {
  return (
    <Link href={href} title={title} className="flex w-fit ml-auto h-10 px-2 mr-2 text-3xl">
      <p className="text-zinc-100">{title}</p>
    </Link>
  );
};
