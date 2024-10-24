import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import Header from "@/components/custom/header";
import Link from "next/link";
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
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Toaster />
                <div className="flex flex-col min-h-screen mx-auto bg-black text-white">
                    {children}
                    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
                        <p className="text-xs text-gray-500">© 2024 Picturesque. All rights reserved.</p>
                        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                            <Link className="text-xs hover:underline underline-offset-4 text-gray-500 hover:text-gray-300" href="/terms">
                                Terms of Service
                            </Link>
                            <Link className="text-xs hover:underline underline-offset-4 text-gray-500 hover:text-gray-300" href="/privacy">
                                Privacy
                            </Link>
                        </nav>
                    </footer>
                </div>
            </body>
        </html>
    );
}
