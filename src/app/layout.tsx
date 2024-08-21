"use client";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar";
import "./globals.css";
import Provider from "@/context/Providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    
    return (
        <html lang="en">
            <Provider>
                <body className={inter.className}>
                    <NavBar />
                    {children}
                    <Toaster />
                </body>
            </Provider>
        </html>
    );
}
