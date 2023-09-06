import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" title="Home" className="flex w-fit">
      <svg className="select-none" width="50" height="50" xmlns="http://www.w3.org/2000/svg">
        <text x="18" y="40" fontFamily="monospace" fontSize="40" fill="#f4f4f5">
          k
        </text>
        <text x="10" y="40" fontFamily="monospace" fontSize="40" fill="#f4f4f5">
          k
        </text>
      </svg>
    </Link>
  );
}
