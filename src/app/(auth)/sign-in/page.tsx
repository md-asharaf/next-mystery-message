"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SignInSchema } from "@/validation/signInSchema";
import Link from "next/link";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function SignIn() {
    const [error, setError] = useState("");
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const signin = async (data: z.infer<typeof SignInSchema>) => {
        try {
            setError("");
            setIsSubmitting(true);
            const result = await signIn("credentials", {
                ...data,
                redirect: false
            });
            console.log("RESULT: ", result);
            if (result?.error) {
                setError("Wrong credentials, Invalid email or password");
            } else {
                router.push("/");
                toast({
                    title: "Sign in successful",
                    description: "You have been signed in",
                });
            }
        } catch (error: any) {
            console.log("ERROR: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="flex-grow flex items-center justify-center bg-gray-800">
            <div className="max-w-md p-8 space-y-8 rounded-lg shadow-md bg-white text-black">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">
                        sign in to start your anonymous adventure
                    </p>
                    {error && (
                        <div className="text-red-500 rounded-md">{error}</div>
                    )}
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(signin)}
                        className="space-y-6"
                    >
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            name="email"
                                            className="peer"
                                        />
                                    </FormControl>

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
                                    <FormControl>
                                        <Input
                                            type="password"
                                            {...field}
                                            name="password"
                                        />
                                    </FormControl>
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
                                "Sign in"
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Not registered yet?{" "}
                        <Link
                            href="/sign-up"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}