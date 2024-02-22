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

const EMOJIS = ['❤️', '💜', '🫶', '🚀', '👽', '🤖'];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col max-h-screen min-w-[275px]">
          <NavBar />
          <div className="overflow-y-auto" tabIndex={-1}>
            <div className="sm:max-w-6xl flex flex-col mx-auto md:pb-4 md:px-2">{children}</div>
            <footer className="flex pb-3 pt-2 pr-4 justify-end tracking-wide text-sm text-zinc-400 border-zinc-700 border-t">
              <a href="https://github.com/stefanluth/kummerkasten">
                Made with {EMOJIS[Math.floor(Math.random() * EMOJIS.length)]}
              </a>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
