import "./globals.css";
import { Inter } from "next/font/google";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kummerkasten",
  description:
    "Anonymes Post Board um Fragen zu stellen, Meinungen zu äußern und Feedback zu geben, ohne sich zu outen.",
  about:
    "Obwohl wir eine offene Kommunikationskultur fördern, gibt es manchmal Fragen oder Meinungen, die man vielleicht nicht persönlich äußern möchte, aus Angst vor Konsequenzen oder einem möglichen Unbehagen bei der Diskussion von sensiblen Themen. Der Kummerkasten bietet einen sicheren und vertraulichen Raum, in dem Mitarbeiter:innen ihre Gedanken und Meinungen frei teilen können.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col max-h-screen">
          <div className="flex w-full h-14 bg-zinc-800 justify-center">
            <div className="flex w-2/3 justify-between">
              <button>
                <QuestionMarkCircleIcon className="w-6 h-6 m-4 text-zinc-100" />
              </button>
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
