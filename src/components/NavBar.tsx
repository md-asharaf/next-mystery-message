"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter} from "next/navigation";
import { toast } from "./ui/use-toast";
export default function NavBar() {
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user;
    const signout = () => {
        signOut({
            redirect: false,
        })
            .then(() => {
                router.push("/sign-in");
            })
            .catch((error: any) => {
                toast({
                    title: "Sign out failed",
                    description: error.message,
                });
            });
    };
    return (
        <nav className="shadow-md bg-gray-900 text-white fixed w-full top-0 right-0 py-2 sm:py-4 md:px-8 px-2 z-20">
            <div className="flex justify-between items-center">
                <a href="/" className="text-xl font-bold">
                    Mystery Message
                </a>
                {user ? (
                    <Button
                        onClick={signout}
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
