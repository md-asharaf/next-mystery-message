import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import { auth } from "../auth/[...nextauth]/auth";
import { AcceptMessageSchema } from "@/validation/AcceptMessageSchema";

export async function POST(req: Request) {
    await dbConnect();
    const session = await auth();
    const user = session?.user;
    if (!session || !user) {
        return Response.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }
    const userId = user._id;
    const { acceptMessage } = await req.json();
    const result = AcceptMessageSchema.safeParse({ acceptMessage });
    if (!result.success) {
        return Response.json(
            {
                success: false,
                message: "Invalid data",
                errors: result.error.errors,
            },
            { status: 400 }
        );
    }
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessages: result.data.acceptMessage,
            },
            { new: true }
        );

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }
        return Response.json(
            {
                success: true,
                message: "Message settings updated successfully",
                user: updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("POST Error in accept-message route: ", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    await dbConnect();
    const session = await auth();
    const user = session?.user;
    if (!session || !user) {
        return Response.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }
    const userId = user._id;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }
        return Response.json(
            {
                success: true,
                message: "fetched isAcceptingMessage successfully",
                isAcceptingMessages: user.isAcceptingMessages,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("GET Error in accept-message route: ", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
