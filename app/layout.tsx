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
    default: "Blank",
    template: "%s | Blank",
  },
  description:
    "A lean Australian storefront for everyday essentials — simple shop, fast checkout.",
  openGraph: {
    title: "Blank",
    description:
      "A lean Australian storefront for everyday essentials — simple shop, fast checkout.",
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
