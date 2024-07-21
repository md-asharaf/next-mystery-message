"use client";
import { signIn, signOut } from "@/app/api/auth/[...nextauth]/auth";
import { useSession } from "next-auth/react";

export default function SignIn() {
    const { data: session } = useSession();
    if (session) {
        return (
            <div>
                
            </div>
        );
    }
    return <button onClick={() => signIn()}>Sign In</button>;
}
