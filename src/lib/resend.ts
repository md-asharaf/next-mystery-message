import { Resend } from "resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    const { error } = await resend.emails.send({
        from: `Mystery Message <no-reply@${process.env.RESEND_DOMAIN}>`,
        to: [email],
        subject: "OTP for email verification",
        react: VerificationEmail({ username, otp: verifyCode }),
    });
    if (error) {
        return { success: false, message: error.message };
    }
    return { success: true, message: "verification email sent" };
}
