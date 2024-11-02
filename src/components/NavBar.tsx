"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
export default function NavBar() {
    const { data: session } = useSession();
    const user = session?.user;
    return (
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white fixed w-full top-0 h-20">
            <div className="container mx-auto flex justify-between items-center">
                <a href="/" className="text-xl font-bold mb-4 md:mb-0">
                    Mystery Message
                </a>
                {user ? (
                    <Button
                        onClick={() =>
                            signOut({
                                redirect: true,
                                redirectTo: "/sign-in",
                            })
                        }
                        className="w-auto bg-slate-100 text-black"
                        variant="outline"
                    >
                        Sign out
                    </Button>
                ) : (
                    <Link href="/sign-in">
                        <Button
                            className="w-full md:w-auto bg-slate-100 text-black"
                            variant="outline"
                        >
                            Sign in
                        </Button>
                    </Link>
                )}
            </div>
        </nav>
    );
}
