import Image from 'next/image';
import Link from 'next/link';

import logo from '@/app/kummerkasten.png';

export function Logo() {
  return (
    <Link href="/" title="Home" draggable={false} className="flex w-fit select-none">
      <Image src={logo} alt="Logo" draggable={false} className="w-12 h-12 p-1 select-none" />
    </Link>
  );
}
