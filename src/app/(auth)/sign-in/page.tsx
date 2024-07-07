"use client";
import { signIn, signOut, auth } from "@/app/api/auth/[...nextauth]/auth";

export default async function SignIn() {
    const session = await auth();
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
