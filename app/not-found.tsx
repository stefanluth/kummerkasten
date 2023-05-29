import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-4 gap-2">
      <h2 className="text-2xl font-bold">Ein Geist!</h2>
      <p className="text-xl">Diese Seite konnte nicht gefunden werden.</p>
      <p>
        Zurück zur{' '}
        <Link href="/faq" className="text-slate-300 underline">
          Hilfe
        </Link>
        .
      </p>
    </div>
  );
}
