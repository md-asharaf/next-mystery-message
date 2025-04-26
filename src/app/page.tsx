"use client"
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { IMessage } from "@/models/message.model";
import axios from "axios";
import { Loader2, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
    const { data: messages, isLoading } = useQuery({
        queryKey: ["messages"],
        queryFn: async (): Promise<IMessage[]> => {
            const response = await axios.get("/api/get-messages");
            return response.data.messages;
        },
    });

    const [api, setApi] = useState<any>(null);
    const [current, setCurrent] = useState(0);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [canScrollPrev, setCanScrollPrev] = useState(false);

    useEffect(() => {
        if (!api) return;

        const onSelect = () => {
            setCurrent(api.selectedScrollSnap());
            setCanScrollNext(api.canScrollNext());
            setCanScrollPrev(api.canScrollPrev());
        };

        api.on("select", onSelect);
        onSelect();
    }, [api]);

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
                // plugins={[Autoplay({ delay: 2000 })]}
                opts={{
                    align: "start",
                    loop: false,
                }}
                setApi={setApi}
                className="w-full max-w-lg md:max-w-xl"
            >
                <CarouselContent>
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

                {messages && messages.length > 1 && (
                    <div className="flex justify-between items-center w-full absolute top-1/2 transform -translate-y-1/2 px-4">
                        {canScrollPrev && <CarouselPrevious className="bg-white text-black" />}
                        {canScrollNext && <CarouselNext className="bg-white text-black"/>}
                    </div>
                )}
            </Carousel>

            <Link href="/dashboard">
                <Button>
                    Go to Dashboard
                </Button>
            </Link>
        </main>
    );
}
