import "./globals.css";

import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import { Providers } from "./providers";

import type { Metadata } from "next";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PHR",
  description: "Create your push notification flow",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>

        <Toaster />
      </body>
    </html>
  );
}
