"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import Link from "next/link";
import { SignInSchema } from "@/validation/signInSchema";
import { signIn } from "@/app/api/auth/[...nextauth]/auth";
const Page = () => {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
        mutationKey: ["sign-up"],
        mutationFn: async (data: z.infer<typeof SignInSchema>) => {
            console.log(data);
            ("use server");
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });
            console.log("login response", result);
            if (result?.error) {
                toast({
                    title: "Login failed",
                    description: result.error,
                });
                return;
            }
            if (result?.url) {
                router.push("/");
            }
        },
    });
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">
                        sign in to start your anonymous adventure
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) => onSubmit(data))}
                        className="space-y-6"
                    >
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        {...field}
                                        name="email"
                                        className="peer"
                                    />
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
};

export default Page;
