import dbConnect from "@/lib/dbConnect";
import { auth } from "../auth/[...nextauth]/auth";
import userModel from "@/models/user.model";
import mongoose from "mongoose";
import { log } from "console";

export async function GET(req: Request) {
    await dbConnect();
    const session = await auth();
    const user = session?.user;
    if (!user) {
        return Response.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }
    const userId = user._id;
    try {
        const foundUser = await userModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "messages",
                    foreignField: "_id",
                    as: "messages",
                },
            },
            {
                $unwind: "$messages",
            },
            {
                $sort: {
                    "messages.createdAt": -1,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: "$messages",
                    },
                },
            },
        ]);        
        if (!foundUser) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        if(foundUser.length === 0) {
            return Response.json(
                { success: true, messages: [] },
                { status: 200 }         
            );
        }
        return Response.json(
            { success: true, messages: foundUser[0].messages },
            { status: 200 }
        );
    } catch (error) {
        console.log("GET Error in get-messages route: ", error);
        return Response.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
