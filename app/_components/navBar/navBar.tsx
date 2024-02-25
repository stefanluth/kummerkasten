import { cookies } from 'next/headers';

import { DesktopNavBar } from '@/app/_components/navBar/desktop';
import { MobileNavBar } from '@/app/_components/navBar/mobile';

export function NavBar() {
  const password = cookies().get('password')?.value;
  const isUnlocked = password === process.env.UNLOCK_PASSWORD;

  return (
    <div className="fixed flex w-full bg-zinc-800 justify-center">
      <div className="xl:w-4/5 px-6 w-full flex h-14 gap-4 justify-between items-center">
        <DesktopNavBar isUnlocked={isUnlocked} />
        <MobileNavBar isUnlocked={isUnlocked} />
      </div>
    </div>
  );
}
