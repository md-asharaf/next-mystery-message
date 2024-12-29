"use client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { MessageSchema } from "@/validation/MessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";

export default function SendMessage() {
    const [isUserAcceptingMessages, setIsUserAcceptingMessages] =
        useState(false);
    const { username } = useParams();

    const form = useForm<z.infer<typeof MessageSchema>>({
        resolver: zodResolver(MessageSchema),
    });

    const submit = async (data: z.infer<typeof MessageSchema>) => {
        try {
            await axios.post("/api/send-message", {
                ...data,
                username,
            });
            toast({
                title: "Message sent",
                description: "Message has been sent successfully",
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description:
                    axiosError.response?.data.message ||
                    "Failed to send message",
                variant: "destructive",
            });
        }
    };

    const { mutate: handleSubmit, isPending } = useMutation({
        mutationKey: ["messages", username],
        mutationFn: submit,
    });

    useEffect(() => {
        const isAcceptingMessages = async () => {
            try {
                const res = await axios.get(`/api/accept-message/`);
                setIsUserAcceptingMessages(res.data?.isAcceptingMessages);
            } catch (error: any) {
                console.error(
                    "Error checking if user is accepting messages: ",
                    error.message
                );
            }
        };
        isAcceptingMessages();
    }, []);

    return (
        <div className="flex-grow">
            <div className="border-[1px] p-4 rounded-lg shadow-xl relative max-w-lg mx-auto mt-20 space-y-4">
                <h1 className="text-2xl font-bold text-center">
                    Send Message Anonymously
                </h1>

                {!isUserAcceptingMessages ? (
                    <div className="text-center text-red-600">
                        <p>This user is currently not accepting messages.</p>
                    </div>
                ) : (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit((data) =>
                                handleSubmit(data)
                            )}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title:</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter a title"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message:</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Type a message"
                                                {...field}
                                                className="min-h-[200px]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                variant="default"
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <Loader2 className="animate-spin h-6 w-6" />
                                ) : (
                                    "Send"
                                )}
                            </Button>
                        </form>
                    </Form>
                )}
            </div>
        </div>
    );
}
