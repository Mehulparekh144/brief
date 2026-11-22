import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono, Martian_Mono } from "next/font/google";
import "./globals.css";

const ui = Instrument_Sans({ subsets: ["latin"], variable: "--font-ui" });
const num = Martian_Mono({ subsets: ["latin"], variable: "--font-num", weight: ["400", "500", "600"] });
const code = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code", weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Brieflab",
  description: "Practice guiding AI coding agents. Get the same result with fewer tokens.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ui.variable} ${num.variable} ${code.variable}`}>
      <body>{children}</body>
    </html>
  );
}
