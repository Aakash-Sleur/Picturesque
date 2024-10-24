import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import Header from "@/components/custom/header";
import Link from "next/link";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Picturesque",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen bg-black text-white">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="py-4 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Picturesque. All rights reserved.
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
