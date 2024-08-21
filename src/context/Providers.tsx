"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {SessionProvider} from "next-auth/react";
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
const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            <QueryClientProvider client={client}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    );
};
export default Provider;
