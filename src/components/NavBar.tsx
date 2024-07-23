import Link from "next/link";
import { Button } from "./ui/button";
import { auth, signOut } from "@/app/api/auth/[...nextauth]/auth";

const NavBar = async () => {
    const session = await auth();
    console.log("user ", session?.user || "user does not exist");
    return (
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="#" className="text-xl font-bold mb-4 md:mb-0">
                    Mystery Message
                </a>
                {session ? (
                    <>
                        <span className="mr-4">
                            Welcome, {session.user?.username}
                        </span>
                        <Button
                            onClick={() => signOut()}
                            className="w-full md:w-auto bg-slate-100 text-black"
                            variant="outline"
                        >
                            Sign out
                        </Button>
                    </>
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
};

export default NavBar;
