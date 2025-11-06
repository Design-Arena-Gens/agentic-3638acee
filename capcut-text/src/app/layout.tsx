import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CapCut Text Animator",
  description: "Create animated text transitions with sound, inspired by CapCut video editing."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink-900 text-slate-100">
        {children}
      </body>
    </html>
  );
}
