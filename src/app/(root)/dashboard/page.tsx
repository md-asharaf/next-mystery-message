"use client";
import { IMessage } from "@/models/message.model";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "axios";
import React from "react";

export default function DashBoard() {
    const { data: session } = useSession();
    const userId = session?.user?._id;
    const { data: messages, isLoading } = useQuery({
        queryKey: ["messages", userId],
        queryFn: async (): Promise<IMessage[]> => {
            try {
                const response = await axios.get("/api/get-messages");
                return response.data?.messages;
            } catch (error: any) {
                console.log(
                    "error fetching messages: ",
                    error.response?.data.message
                );
                return error;
            }
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <h1>{session?.user.use}</h1>
            <h1 className="text-2xl font-bold">
                {messages ? "All Messages" : "No message"}
            </h1>
            <div className="flex flex-col space-y-8">
                {messages?.map((message) => (
                    <div>
                        <p>{message.content}</p>
                    </div>
                ))}
            </div>
        </>
    );
}
