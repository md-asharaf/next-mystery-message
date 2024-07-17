import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import { UsernameSchema } from "@/validation/signUpSchema";
export async function GET(req: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");
        //validate with zod
        const result = UsernameSchema.safeParse(username);
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
        const parsedUsername = result.data;
        const existingVerifiedUser = await userModel.findOne({
            username: parsedUsername,
            isVerified: true,
        });
        if (existingVerifiedUser) {
            return Response.json(
                { success: false, message: "Username already exists" },
                { status: 405 }
            );
        }
        return Response.json(
            { success: true, message: "Username is available" },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error checking username availability: ", error);
        return Response.json(
            { success: false, message: "Error checking username availability" },
            { status: 500 }
        );
    }
}
