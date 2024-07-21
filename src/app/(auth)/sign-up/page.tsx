"use client";
import { SignUpSchema } from "@/validation/signUpSchema";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
const page = () => {
    const [username, setUsername] = useState("");
    const [userMessage, setUserMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const debounced = useDebounceCallback(setUsername, 500);
    const router = useRouter();
    const toast = useToast();
    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });
    const checkUsername = async () => {
        setIsCheckingUsername(true);
        setUserMessage("");
        if (username) {
            try {
                const response = await axios.get(
                    `/api/unique-user?username=${username}`
                );
                setUserMessage(response.data?.message || "");
            } catch (error: any) {
                if (error instanceof AxiosError) {
                    setUserMessage(error.response?.data?.message);
                } else {
                    setUserMessage(error?.message);
                }
            }
        }
        setIsCheckingUsername(false);
    };
    const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
        mutationKey: ["sign-up"],
        mutationFn: async (data: z.infer<typeof SignUpSchema>) => {
            console.log(data);
            const response = await axios.post("/api/sign-up", data);
            router.push("/sign-up/verify-otp");
        },
    });
    useEffect(() => {
        checkUsername();
    }, [username]);
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join True Feedback
                    </h1>
                    <p className="mb-4">
                        Sign up to start your anonymous adventure
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) => onSubmit(data))}
                        className="space-y-6"
                    >
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <Input
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            debounced(e.target.value);
                                        }}
                                    />
                                    {isCheckingUsername && (
                                        <Loader2 className="animate-spin" />
                                    )}
                                    {!isCheckingUsername && userMessage && (
                                        <p
                                            className={`text-sm ${
                                                userMessage ===
                                                "username is unique"
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {userMessage}
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input {...field} name="email" />
                                    <p className="text-muted text-gray-400 text-sm">
                                        We will send you a verification code
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        type="password"
                                        {...field}
                                        name="password"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default page;