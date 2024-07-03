import { Resend } from "resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_DOMAIN_EMAIL || "",
            to: email,
            subject: "hello world",
            react: VerificationEmail({ username, otp: verifyCode }),
        });
    } catch (error) {
        return { success: false, message: "failed to send verification email" };
    }
}
