"use client";
import { IMessage } from "@/models/message.model";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptMessageSchema } from "@/validation/AcceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/components/ui/use-toast";

export default function DashBoard() {
    const [uniqueLink, setUniqueLink] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const { data: session } = useSession();
    const { watch, register, setValue } = useForm({
        resolver: zodResolver(AcceptMessageSchema),
    });
    const user = session?.user;
    const acceptMessage = watch("acceptMessage");

    useEffect(() => {
        if (user && typeof window !== "undefined") {
            setUniqueLink(
                `${window.location.protocol}//${window.location.host}/u/${user.username}`
            );
        }
    }, [user]);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(uniqueLink);
        if (inputRef.current) {
            inputRef.current.select();
        }
        toast({
            title: "Link copied to clipboard",
            variant: "default",
        });
    };

    const deleteMessage = async (messageId: string) => {
        setMessages((prev) =>
            prev.filter((message) => message._id !== messageId)
        );
    };

    const fetchMessages = async () => {
        try {
            const response = await axios.get("/api/get-messages");
            setMessages(response.data?.messages);
            return response.data?.messages;
        } catch (error: any) {
            console.log(
                "error fetching messages: ",
                error.response?.data.message
            );
            return error;
        }
    };

    const fetchAcceptMessage = async () => {
        try {
            const response = await axios.get<ApiResponse>(
                "/api/accept-message"
            );
            setValue("acceptMessage", response.data.isAcceptingMessages);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description:
                    axiosError.response?.data.message ||
                    "Failed to fetch message settings",
                variant: "destructive",
            });
        } finally {
            return null;
        }
    };

    const toggleAcceptMessage = async () => {
        try {
            await axios.post<ApiResponse>("/api/accept-message", {
                acceptMessage: !acceptMessage,
            });
            setValue("acceptMessage", !acceptMessage);
            toast({
                title: "Success",
                description: "Message settings updated successfully",
                variant: "default",
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description:
                    axiosError.response?.data.message ||
                    "Failed to fetch message settings",
                variant: "destructive",
            });
        }
    };

    const { refetch, isFetching } = useQuery({
        queryKey: ["messages", user?._id],
        queryFn: fetchMessages,
        enabled: !!user?._id,
    });

    useQuery({
        queryKey: ["accept-message", user?._id],
        queryFn: fetchAcceptMessage,
        enabled: !!user?._id,
    });

    const { mutate: handleSwitchChange, isPending: isSwitchLoading } =
        useMutation({
            mutationKey: ["accept-message", user?._id],
            mutationFn: toggleAcceptMessage,
        });

    if (!user) {
        return null;
    }

    return (
        <div className="flex-grow px-2">
            <div className="mt-4 sm:mt-10 max-w-full sm:max-w-[90%] md:max-w-[75%] space-y-4 mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold pl-2">
                    User Dashboard
                </h1>
                <div>
                    <div className="ml-4 mb-2 text-sm sm:text-base">
                        Copy Your Unique Link
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
                        <input
                            ref={inputRef}
                            value={uniqueLink}
                            readOnly
                            type="text"
                            className="w-full p-2 bg-zinc-100 rounded-lg outline-none"
                        />
                        <Button
                            onClick={copyToClipboard}
                            className="w-full sm:w-auto"
                        >
                            Copy
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <Switch
                        {...register("acceptMessage")}
                        checked={acceptMessage}
                        onCheckedChange={() => handleSwitchChange()}
                        disabled={isSwitchLoading}
                    />
                    <div className="text-sm sm:text-base">
                        Accept Messages: {acceptMessage ? "On" : "Off"}
                    </div>
                </div>
                <button
                    onClick={() => refetch()}
                    className="px-2 py-1 bg-white shadow rounded flex items-center"
                >
                    <RefreshCw
                        className={`${
                            isFetching ? "animate-spin" : ""
                        } w-5 h-5`}
                    />
                </button>
                <div className="grid gap-4 sm:grid-cols-2">
                    {messages?.map((message) => (
                        <div key={message.id}>
                            <MessageCard
                                message={message}
                                onDelete={deleteMessage}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
