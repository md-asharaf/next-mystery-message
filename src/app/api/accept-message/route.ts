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
    const userId = user.id;
    const { acceptMessages } = await req.json();
    const result = AcceptMessageSchema.safeParse({ acceptMessages });
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
                isAcceptingMessage: result.data.acceptMessages,
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
                message: "User updated successfully",
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
    const userId = user.id;
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
                isAcceptingMessage: user.isAcceptingMessage,
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
