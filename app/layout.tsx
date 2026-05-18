import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Resume Builder",
  description: "Build a professional resume with AI in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-zinc-100">
        <header className="no-print sticky top-0 z-30 border-b border-white/10 bg-[#0a0a0a]/85 backdrop-blur-md">
          <div className="mx-auto text-center w-full items-center  px-6 py-4 sm:px-10">
            <div className="">
              <Link href="/" className="text-2xl font-semibold text-white">
                CVForge
              </Link>
            </div>
              <span className="absolute right-4 top-4 rounded-full border border-violet-400/40 bg-violet-500/10 px-2.5 py-0.5 text-sm font-semibold text-violet-200">
                Beta Version
              </span>
          </div>
        </header>

        {children}

        <footer className="no-print mt-auto border-t border-white/10 bg-[#0a0a0a]/85 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-zinc-400 sm:flex-row sm:px-10">
            <p className="text-center sm:text-left">
              CVForge · Built by Tezsid Designs Pvt Ltd.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/disclaimer" className="transition hover:text-white">
                Disclaimer
              </Link>
              <Link href="/privacy-policy" className="transition hover:text-white">
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
