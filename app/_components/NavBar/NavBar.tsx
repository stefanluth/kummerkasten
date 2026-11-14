import { cookies } from 'next/headers';

import { SESSION_COOKIE_NAME, verifyUnlockSessionToken } from '@/utils/auth-session';
import { getEnv } from '@/utils/env';

import { ThemeToggle } from '../ThemeToggle';
import { DesktopNavBar } from './DesktopNavBar';
import { MobileNavBar } from './MobileNavBar';

export async function NavBar() {
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const isUnlocked = await verifyUnlockSessionToken(session, getEnv().sessionSecret);

  return (
    <div className="fixed flex w-full bg-zinc-800 justify-center">
      <div className="xl:w-4/5 px-6 w-full flex h-14 gap-4 justify-between items-center">
        <DesktopNavBar isUnlocked={isUnlocked} />
        <MobileNavBar isUnlocked={isUnlocked} />
        <ThemeToggle />
      </div>
    </div>
  );
}
