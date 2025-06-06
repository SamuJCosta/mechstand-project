import type { Metadata } from "next";
import { Poppins, Smooch_Sans } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "800"],
});

const smoochSans = Smooch_Sans({
  variable: "--font-smooch-sans",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Mechstand",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${poppins.variable} ${smoochSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
