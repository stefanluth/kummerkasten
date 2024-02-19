import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-4 gap-2">
      <h2 className="text-2xl font-bold">A ghost!</h2>
      <p className="text-xl">This page could not be found.</p>
      <p>
        To{' '}
        <Link href="/faq" className="text-slate-300 underline">
          the FAQ.
        </Link>
        .
      </p>
    </div>
  );
}
