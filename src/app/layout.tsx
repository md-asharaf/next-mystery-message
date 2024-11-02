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
                <body className={inter.className + " h-screen flex flex-col"}>
                    <div className="h-20">
                        <NavBar />
                    </div>
                    <div className="flex-grow">{children}</div>
                    <footer className="h-10 text-center p-4 md:p-6 bg-gray-900 text-white">
                        © 2023 True Feedback. All rights reserved.
                    </footer>
                    <Toaster />
                </body>
            </Provider>
        </html>
    );
}
