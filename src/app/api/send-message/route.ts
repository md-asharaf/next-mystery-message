import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import messageModel from "@/models/message.model";
import { ObjectId } from "mongoose";
export async function POST(req: Request) {
    await dbConnect();
    const { title,content, username } =
        await req.json();

    try {
        const existingUser = await userModel.findOne({ username });
        if (!existingUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }
        // create a message in database and push it to the user's messages array
        const newMessage = await messageModel.create({
            content,
            title
        });
        existingUser.messages.push(newMessage._id as ObjectId);

        await existingUser.save();

        return Response.json(
            {
                success: true,
                message: "Message sent successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
