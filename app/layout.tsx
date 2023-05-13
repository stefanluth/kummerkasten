import "./globals.css";
import { Inter } from "next/font/google";
import { NavBar } from "./navBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kummerkasten",
  description:
    "Anonymes Post Board um Fragen zu stellen, Meinungen zu äußern und Feedback zu geben, ohne sich zu outen.",
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
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  );
}
