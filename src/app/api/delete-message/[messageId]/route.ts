import dbConnect from "@/lib/dbConnect";
import messageModel from "@/models/message.model";
import { auth } from "../../auth/[...nextauth]/auth";
import userModel from "@/models/user.model";

export async function DELETE(req: Request,{params}:{params:{messageId:string}}) {
    await dbConnect();
    try {
        const messageId = params.messageId;
        //check if message exists
         const session = await auth();
        const user = session?.user;
        if (!user) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }
        const existingMessage = await messageModel.findById(messageId);
        if (!existingMessage) {
            return Response.json(
                {
                    message: "Message does not exist",
                    success: false,
                },
                {
                    status: 400,
                }
            );
        }
        //delete message
        await messageModel.findByIdAndDelete(existingMessage._id);
        await userModel.findByIdAndUpdate(user._id, {
            $pull: { messages: existingMessage._id },
        })
        return Response.json(
            {
                message: "Message deleted successfully",
                success: true,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return Response.json(
            {
                message: "An error occurred",
                success: false,
            },
            {
                status: 500,
            }
        );
    }
}
