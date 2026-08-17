import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import CustomScrollbar from "@/components/CustomScrollbar";

const quicksand = Quicksand({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Digital Flamingo",
  description: "Frontend developer webpage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
       <LanguageProvider>
          <LanguageToggle />
          {children}
        </LanguageProvider>
        <CustomScrollbar />
      </body>
    </html>
  );
}
