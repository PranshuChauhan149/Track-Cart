import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className=" w-full h-screen bg-linear-to-b from-green-100 to-white">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
