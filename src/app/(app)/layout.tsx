"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
const client = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60000, // Data is considered fresh for 1 minute
            refetchOnWindowFocus: true, // Refetch on window focus for up-to-date data
            refetchOnMount: true, // Refetch when component mounts if data is stale
            refetchOnReconnect: true, // Refetch on reconnect
            retry: 1, // Retry failed queries once
            refetchInterval: false, // No periodic refetching by default
            refetchIntervalInBackground: false, // No background periodic refetching
        },
    },
});
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <AuthProvider>
                <QueryClientProvider client={client}>
                    <body className={inter.className}>
                        {children}
                        <Toaster />
                    </body>
                </QueryClientProvider>
            </AuthProvider>
        </html>
    );
}
