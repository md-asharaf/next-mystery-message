import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import UserModel from "@/models/user.model";
import { sendVerificationEmail } from "@/lib/resend";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await req.json();
        //check if user already exists by this email or username
        const existingUser = await UserModel.findOne({
            $or: [{ username }, { email }],
        });
        //if user exists and verified
        if (existingUser) {
            if (!existingUser.isVerified) {
                //delete from db
                await UserModel.deleteOne({ _id: existingUser._id });
            } else {
                //send failed response
                return Response.json(
                    {
                        success: false,
                        message:
                            "User already exists with this email or username",
                    },
                    { status: 400 }
                );
            }
        }
        //generate otp and hashed password
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 3600000);
        const hashedPassword = await bcrypt.hash(password, 10);
        //if user does not exist or user exists with this username
        if (!existingUser || existingUser.username === username) {
            // create new user and save it to database
            await UserModel.create({
                username,
                email,
                password: hashedPassword,
                verifyCode: otp,
                verifyCodeExpires: otpExpiry,
            });
        } else {
            // update the existing user
            existingUser.verifyCode = otp;
            existingUser.password = hashedPassword;
            existingUser.verifyCodeExpires = otpExpiry;
            await existingUser.save();
        }
        //send verification email
        const { message } = await sendVerificationEmail(email, username, otp);
        console.log(message);
        //send success response
        return Response.json(
            { success: true, message: "user registered" },
            { status: 201 }
        );
    } catch (error) {
        console.log("Error in registering user: ", error);
        //send failed response
        return Response.json(
            { success: false, message: "error registering user" },
            { status: 500 }
        );
    }
}
