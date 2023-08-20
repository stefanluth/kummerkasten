import Link from 'next/link';

import { HomeIcon, InformationCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export function NavBar() {
  return (
    <div className="flex w-full bg-zinc-800 justify-center">
      <div className="flex w-2/3 h-14 gap-4 justify-between items-center">
        <div className="flex gap-2 w-full">
          <Link href="/" title="Home" className="w-6 h-6 mr-4 rounded-md">
            <HomeIcon className="w-6 h-6 text-zinc-100" />
          </Link>
          <Link href="/top/day" title="24h" className="h-6 px-2 rounded-md">
            <p className="text-zinc-100">24h</p>
          </Link>
          <Link href="/top/week" title="7d" className="h-6 px-2 rounded-md">
            <p className="text-zinc-100">7d</p>
          </Link>
          <Link href="/top/month" title="30d" className="h-6 px-2 rounded-md">
            <p className="text-zinc-100">30d</p>
          </Link>
          <Link href="/top/year" title="1y" className="h-6 px-2 rounded-md">
            <p className="text-zinc-100">1y</p>
          </Link>
          <Link href="/top/all" title="All" className="h-6 px-2 rounded-md">
            <p className="text-zinc-100">All</p>
          </Link>
        </div>
        <h1 className="text-2xl font-bold mx-8 text-zinc-100 select-none">Kummerkasten</h1>
        <div className="flex w-full gap-4 justify-end">
          <Link href="/unlock" title="Unlock" className="flex h-6 gap-2 px-2 rounded-md">
            <LockClosedIcon className="w-6 h-6 text-zinc-100" />
            Unlock
          </Link>
          <Link href="/faq" title="FAQ" className="flex h-6 gap-2 px-2 rounded-md">
            <InformationCircleIcon className="w-6 h-6 text-zinc-100" />
            FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
