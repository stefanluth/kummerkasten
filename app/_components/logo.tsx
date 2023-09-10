import Image from 'next/image';
import Link from 'next/link';

import logo from '@/app/kummerkasten.png';

export function Logo() {
  return (
    <Link href="/" title="Home" className="flex w-fit">
      <Image src={logo} alt="Logo" className="w-12 h-12 rounded-md" />
    </Link>
  );
}
