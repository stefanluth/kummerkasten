import "./globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";

import { NavBar } from "@/app/_components/navBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kummerkasten",
  description:
    "Anonymes Nachrichten Brett um Fragen zu stellen, Meinungen zu äußern und Feedback zu geben, ohne sich zu outen.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col max-h-screen">
          <NavBar />
          <div className="overflow-y-auto pb-4">
            <div className="flex flex-col min-w-[30rem] max-w-6xl mx-auto">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
