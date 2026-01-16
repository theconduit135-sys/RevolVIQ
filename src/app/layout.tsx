import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PanicButton } from "@/components/features/PanicButton";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RevolvIQ | Capital Readiness Intelligence",
  description: "Automated underwriting analysis and capital packaging.",
};

import { Providers } from "@/components/providers/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen bg-background antialiased`}>
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            {children}
          </div>

          {/* Persistent Panic Button */}
          <PanicButton currentTier="DIY" />
        </Providers>
      </body>
    </html>
  );
}
