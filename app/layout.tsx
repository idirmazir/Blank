import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteLayout } from "@/components/layout/site-layout";

import { Providers } from "./providers";
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
  title: {
    default: "Blank — Substance over status.",
    template: "%s | Blank",
  },
  description:
    "No logos. No slogans. No status symbols. Only substance. Blank curates exceptional essentials sourced directly from manufacturers.",
  openGraph: {
    title: "Blank — Substance over status.",
    description:
      "No logos. No slogans. No status symbols. Only substance. Curated essentials sourced directly from makers.",
    locale: "en_AU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <Providers>
          <SiteLayout>{children}</SiteLayout>
        </Providers>
      </body>
    </html>
  );
}
