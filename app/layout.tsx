import { Metadata } from 'next';

import React from 'react';

import { Inter } from 'next/font/google';

import { NavBar } from '@/app/_components/navBar';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kummerkasten',
  description: 'Anonymous message board to ask questions, express opinions, and give feedback without outing yourself.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col max-h-screen min-w-[275px]">
          <NavBar />
          <div className="overflow-y-auto md:pb-4 md:px-2" tabIndex={-1}>
            <div className="sm:max-w-6xl flex flex-col mx-auto">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
