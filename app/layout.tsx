import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alaafia AI Companion",
  description: "An AI Companion for the Elderly",
  generator: "https://botuns.vercel.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
