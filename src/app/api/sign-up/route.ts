import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
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
        if (existingUser && existingUser.isVerified) {
            //send failed response
            return Response.json(
                {
                    success: false,
                    message: "User already exists with this email or username",
                },
                { status: 400 }
            );
        }
        //generate otp and hashed password
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        //if user does not exist or user exists with this username
        if (!existingUser || existingUser.username === username) {
            // create new user and save it to database
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
            });
            await newUser.save();
        } else {
            // update the existing user
            existingUser.verifyCode = otp;
            existingUser.password = hashedPassword;
            existingUser.verifyCodeExpires = new Date(Date.now() + 3600000);
            await existingUser.save();
        }
        //send verification email
        const emailSent = await sendVerificationEmail(email, username, otp);
        //if email sending failed
        if (!emailSent?.success) {
            console.log("Error in sending email: ", emailSent?.message);
            // send failed response
            return Response.json(
                { success: false, message: emailSent.message },
                { status: 500 }
            );
        }
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
