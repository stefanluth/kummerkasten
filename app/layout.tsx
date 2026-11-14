import { Metadata } from 'next';

import React from 'react';

import { Inter } from 'next/font/google';

import { ScrollToTop } from '@/app/_components';
import { NavBar } from '@/app/_components/NavBar';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kummerkasten',
  description: 'Anonymous message board to ask questions, express opinions, and give feedback without outing yourself.',
};

const EMOJIS = ['❤️', '💜', '🫶', '🚀', '👽', '🤖'];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try { const theme = localStorage.getItem('theme'); if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme; } catch {}`,
          }}
        />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <NavBar />
        <div className="flex flex-col flex-1 w-full max-w-5xl xl:max-w-7xl mx-auto pt-14 pb-10 px-2 md:pb-4">
          {children}
        </div>
        <ScrollToTop />
        <footer className="flex justify-end h-10 pb-3 pt-2 pr-4 w-full tracking-wide text-sm text-zinc-400 border-zinc-700 border-t">
          <a href="https://github.com/stefanluth/kummerkasten">
            Made with {EMOJIS[Math.floor(Math.random() * EMOJIS.length)]}
          </a>
        </footer>
      </body>
    </html>
  );
}
