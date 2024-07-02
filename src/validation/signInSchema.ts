import * as z from "zod";

const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default SignInSchema;
