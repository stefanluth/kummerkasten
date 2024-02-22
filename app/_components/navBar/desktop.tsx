import { HomeIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

import { Logo } from '../logo';
import { NavLink } from './navLink';
import { UnlockIcon } from './unlockIcon';

export function DesktopNavBar(props: { isUnlocked: boolean }) {
  return (
    <>
      <div className="md:flex gap-2 w-fit hidden">
        <NavLink href="/" title="Home" className="mr-4">
          <HomeIcon className="w-6 h-6 text-zinc-100" />
        </NavLink>
        <NavLink href="/top/day" title="24h" />
        <NavLink href="/top/week" title="7d" />
        <NavLink href="/top/month" title="30d" />
        <NavLink href="/top/year" title="1y" />
        <NavLink href="/top/all" title="All" />
      </div>
      <div className="md:flex hidden">
        <Logo />
      </div>
      <div className="md:flex w-fit gap-4 hidden">
        <NavLink href="/unlock" className="flex gap-2 px-2">
          <UnlockIcon isUnlocked={props.isUnlocked} />
        </NavLink>
        <NavLink href="/faq" className="flex gap-2 px-2">
          <InformationCircleIcon className="w-6 h-6 text-zinc-100" />
          FAQ
        </NavLink>
      </div>
    </>
  );
}
