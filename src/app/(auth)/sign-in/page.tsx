// import { signIn } from "@/app/api/auth/[...nextauth]/auth";

// export default function SignIn() {
//     return (
//         <form
//             action={async () => {
//                 "use server";
//                 await signIn();
//             }}
//         >
//             <button type="submit">Sign in</button>
//         </form>
//     );
// }
"use client";
import { signIn } from "next-auth/react";

export default function SignIn() {
    return <button onClick={() => signIn()}>Sign In</button>;
}
