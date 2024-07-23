import dbConnect from "@/lib/dbConnect";
import messageModel from "@/models/message.model";

export async function DELETE(req: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const messageId = searchParams.get("messageId");
        //check if message exists
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
