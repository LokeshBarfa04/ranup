import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgroSeeds — Premium Agricultural Seeds",
  description:
    "Cultivating tomorrow's harvest today. Premium quality seeds, agronomic excellence, and sustainable farming solutions for India's modern farmers.",
  keywords: ["seeds", "agriculture", "farming", "crop seeds", "India", "agroseeds"],
  openGraph: {
    title: "AgroSeeds — Premium Agricultural Seeds",
    description: "Cultivating tomorrow's harvest today.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
