import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import { VerifyCodeSchema } from "@/validation/VerifyCodeSchema";

export default async function POST(req: Request) {
    await dbConnect();
    try {
        const { OTP, username } = await req.json();
        const decodedUsername = decodeURIComponent(username);

        const existingUser = await userModel.findOne({
            username: decodedUsername,
        });
        if (!existingUser) {
            return Response.json(
                { success: false, message: "username does not exist" },
                { status: 400 }
            );
        }
        //validate with zod
        const result = VerifyCodeSchema.safeParse({ code: OTP });
        if (!result?.success) {
            return Response.json(
                {
                    success: false,
                    message:
                        "ERROR in validating with zod:  " +
                        result?.error.format()._errors.join(", "),
                },
                { status: 400 }
            );
        }
        const { code } = result.data;
        const isOTPvalid = code === existingUser.verifyCode;
        const isCodeExpired = existingUser.verifyCodeExpires > new Date();
        if (isCodeExpired) {
            return Response.json(
                {
                    success: false,
                    message: "expiry code expired,please verify again",
                },
                { status: 400 }
            );
        } else if (!isOTPvalid) {
            return Response.json(
                { success: false, message: "Invalid OTP" },
                { status: 400 }
            );
        }
        existingUser.isVerified = true;
        await existingUser.save();
        return Response.json(
            { success: true, message: "User verified successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error in verifying OTP :", error);
        return Response.json(
            { success: false, message: "Error in verifying OTP" },
            { status: 500 }
        );
    }
}
