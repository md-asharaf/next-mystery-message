"use client";
import { signIn, signOut } from "@/app/api/auth/[...nextauth]/auth";
import { useSession } from "next-auth/react";

export default function SignIn() {
    const { data: session } = useSession();
    if (session) {
        return (
            <div>
                <h1>{session.user?.name} is signed in</h1>
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        );
    }
    return <button onClick={() => signIn()}>Sign In</button>;
}
