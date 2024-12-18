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
                <body
                    className={inter.className + " min-h-screen flex flex-col"}
                >
                    <div className="h-[52px] sm:h-[68px]">
                        <NavBar />
                    </div>
                    {children}
                    <footer className="h-[24px] sm:h-[40px]">
                        <div className="fixed bottom-0 w-full text-center sm:p-2 bg-gray-900 text-white z-20">
                            © 2023 True Feedback. All rights reserved.
                        </div>
                    </footer>

                    <Toaster />
                </body>
            </Provider>
        </html>
    );
}
