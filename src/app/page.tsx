"use client";
import { Loader2, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { IMessage } from "@/models/message.model";
import { useRouter } from "next/navigation";
export default function Home() {
    const router = useRouter();
    const { data: messages, isLoading } = useQuery({
        queryKey: ["messages"],
        queryFn: async (): Promise<IMessage[]> => {
            const response = await axios.get("/api/get-messages");
            return response.data.messages;
        },
    });
    if (isLoading) {
        return (
            <Loader2 className="h-6 animate-spin flex items-center justify-center w-full mt-20" />
        );
    }
    return (
            <main className="flex-grow flex flex-col items-center px-4 md:px-24 py-12 text-white h-full bg-gray-800">
                <section className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold">
                        Dive into the World of Anonymous Feedback
                    </h1>
                    <p className="mt-3 md:mt-4 text-base md:text-lg">
                        True Feedback - Where your identity remains a secret.
                    </p>
                </section>
                <Carousel
                    plugins={[Autoplay({ delay: 2000 })]}
                    className="w-full max-w-lg md:max-w-xl"
                >
                    <CarouselContent
                        onClick={() => router.replace("/dashboard")}
                    >
                        {messages?.map((message: IMessage, index: number) => (
                            <CarouselItem key={index} className="p-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{message.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                                        <Mail className="flex-shrink-0" />
                                        <div>
                                            <p>{message.content}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(
                                                    message.createdAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </main>
    );
}
