import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plumbers 911 | Chicago's Top-Paying Plumbing Positions",
  description:
    "Earn $125K–$200K+ as a service plumber in Chicago. World-class benefits, pension, 401(k). Limited positions available. Apply now.",
  keywords: [
    "plumber jobs Chicago",
    "service plumber hiring",
    "plumbing careers",
    "journeyman plumber jobs",
    "plumber salary Chicago",
  ],
  openGraph: {
    title: "Plumbers 911 | Earn $125K–$200K+ in Chicago",
    description:
      "Chicago's top plumbing positions with world-class benefits. Limited spots — apply now.",
    type: "website",
    url: "https://plumbers911jobs.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
