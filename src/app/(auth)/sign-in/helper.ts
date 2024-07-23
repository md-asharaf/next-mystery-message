"use server";

import { signIn } from "@/app/api/auth/[...nextauth]/auth";

export async function signInHelper(data: any) {
    console.log("data ", data);
    try {
        const result = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
        });
        console.log("login response", result);
        if (result?.error) {
            return { message: "error in sign in" };
        }
        if (result?.url) {
            return { url: result.url };
        }
    } catch (error) {
        console.log("error ", error);
    }
}
/*toast({
    title: "Login failed",
    description: result.error,
});
router.push("/");
*/
