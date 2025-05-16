import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SolanaPriceProvider } from "@/contexts/SolanaPriceContext";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BitByBit - Crypto Roundups",
  description: "Turn everyday purchases into crypto investments through roundups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <SolanaPriceProvider>
            {children}
          </SolanaPriceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
