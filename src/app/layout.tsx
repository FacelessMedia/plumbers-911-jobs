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
    "Plumbing jobs in Chicagoland — earn up to $60.50/hr. Apprentices to journeymen welcome. World-class benefits, pension, 401(k). Apply now.",
  keywords: [
    "plumber jobs Chicago",
    "service plumber hiring",
    "plumbing careers",
    "journeyman plumber jobs",
    "plumber salary Chicago",
  ],
  openGraph: {
    title: "Plumbers 911 | Earn Up to $60.50/hr in Chicagoland",
    description:
      "Chicagoland plumbing positions for apprentices and journeymen. World-class benefits. 12 spots — apply now.",
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
