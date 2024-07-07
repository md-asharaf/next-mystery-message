import * as z from "zod";
export const UsernameSchema = z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(
        /^[a-zA-Z0-9_]*$/,
        "Username must only contain letters, numbers, and underscores"
    );
export const SignUpSchema = z.object({
    username: UsernameSchema,
    email: z.string().email("Please fill a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});
