"use client";
import { IMessage } from "@/models/message.model";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptMessageSchema } from "@/validation/AcceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/components/ui/use-toast";

export default function DashBoard() {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const { data: session } = useSession();
    const { watch, register, setValue } = useForm({
        resolver: zodResolver(AcceptMessageSchema),
    });
    const user = session?.user;
    const uniqueLink = `${window.location.protocol}//${window.location.host}/u/${user?.username}`;
    const acceptMessage = watch("acceptMessage");
    const copyToClipboard = async () => {
        navigator.clipboard.writeText(uniqueLink);
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
            const response = await axios.post<ApiResponse>(
                "/api/accept-message",
                {
                    acceptMessage: !acceptMessage,
                }
            );
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
    const { refetch, isLoading } = useQuery({
        queryKey: ["messages", user?._id],
        queryFn: fetchMessages,
        enabled: !!user?._id,
    });
    const {} = useQuery({
        queryKey: ["accept-message", user?._id],
        queryFn: fetchAcceptMessage,
        enabled: !!user?._id,
    });
    const { mutate: handleSwitchChange, isPending: isSwitchLoading } =
    useMutation({
        mutationKey: ["accept-message", user?._id],
        mutationFn: toggleAcceptMessage,
    });
    if (isLoading) {
        return <Loader2 className="animate-spin h-6 w-6 mx-auto mt-10" />;
    }
    if(!user){
        return null;
    }
    return (
        <div className="mt-10 max-w-[90%] sm:max-w-[75%]  space-y-4 mx-auto">
            <h1 className="text-4xl font-bold">User Dashboard</h1>
            <div>
                <div className="ml-4 mb-2">Copy Your Unique Link</div>
                <div className="flex">
                    <input

                        value={uniqueLink}
                        disabled
                        type="text"
                        className="w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>
            <div className="flex space-x-4 items-center">
                <Switch
                    {...register("acceptMessage")}
                    checked={acceptMessage}
                    onCheckedChange={() => handleSwitchChange()}
                    disabled={isSwitchLoading}
                />
                <div>Accept Messages: {acceptMessage ? "On" : "Off"}</div>
            </div>
            <button
                onClick={() => refetch()}
                className="px-2 py-1 bg-white shadow rounded"
            >
                <RefreshCw className={`${isLoading && "animate-spin"}`} />
            </button>
            <div className="flex flex-1">
                {messages?.map((message) => (
                    <div
                        key={message._id as string}
                        className="w-full lg:w-1/2"
                    >
                        <MessageCard
                            message={message}
                            onDelete={deleteMessage}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
