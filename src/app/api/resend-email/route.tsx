import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/lib/resend";
import userModel from "@/models/user.model";

export async function PATCH(req: Request) {
    await dbConnect();
    try {
        const { username } = await req.json();
        const existingUser = await userModel.findOne({
            username,
        });
        if (!existingUser) {
            return Response.json(
                { success: false, message: "User does not exist" },
                { status: 400 }
            );
        }
        if (existingUser.isVerified) {
            return Response.json(
                { success: false, message: "User already verified" },
                { status: 400 }
            );
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 3600000);
        existingUser.verifyCode = otp;
        existingUser.verifyCodeExpires = otpExpires;
        await existingUser.save();
        const emailSent = await sendVerificationEmail(
            existingUser.email,
            username,
            otp
        );
        if (!emailSent?.success) {
            console.log("Error in sending email: ", emailSent?.message);
            return Response.json(
                { success: false, message: emailSent.message },
                { status: 500 }
            );
        }
        return Response.json(
            { success: true, message: "email sent successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error in resending verification email: ", error);
        return Response.json(
            {
                success: false,
                message: "Error in resending verification email",
            },
            { status: 500 }
        );
    }
}
